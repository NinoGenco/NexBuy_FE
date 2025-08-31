/**
 * Factory per creare RegExp "ancorate" ^...$ con supporto a gruppi di caratteri
 * Unicode (lettere, separatori di spazio) e simboli comuni.
 *
 * Nota: viene usato \p{...} → richiede il flag 'u' (Unicode) nelle RegExp JS.
 */
type RxOpts = {
    letters?: boolean;        // \p{L}
    digits?: boolean;         // 0-9
    spaces?: boolean;         // \p{Zs} (spazi "normali", non \s che include newline)
    dashes?: boolean;         // -
    apostrophes?: boolean;    // '
    dots?: boolean;           // .
    underscores?: boolean;    // _
    at?: boolean;             // @
    slashes?: boolean;        // /  (se ti serve per slug, ecc.)
    extra?: string;           // char extra già escaped (es: ,&)
    min?: number;             // default 1
    max?: number;             // default = min (se non specificato)
};


/**
 * Costruisce una `RegExp` **ancorata** (`^...$`) a partire da un insieme di gruppi di caratteri
 * abilitabili (lettere, cifre, spazi, ecc.), con supporto **Unicode** tramite flag `'u'`.
 *
 * L’espressione risultante corrisponde a una sequenza di soli caratteri ammessi,
 * lunga tra `min` e `max` (inclusi). Se `max` non è specificato, la lunghezza è esattamente `min`.
 *
 * @param opts                     Opzioni per definire il set di caratteri e la lunghezza.
 * @param opts.letters             Include tutte le **lettere Unicode** (`\p{L}`).
 * @param opts.digits              Include le **cifre** `0-9`.
 * @param opts.spaces              Include **separatori di spazio** Unicode (`\p{Zs}`) — non usa `\s`.
 * @param opts.dashes              Include il **trattino** `-`.
 * @param opts.apostrophes         Include l’**apostrofo** `'`.
 * @param opts.dots                Include il **punto** `.`.
 * @param opts.underscores         Include l’**underscore** `_`.
 * @param opts.at                  Include la **chiocciola** `@`.
 * @param opts.slashes             Include lo **slash** `/`.
 * @param opts.extra               Stringa di caratteri **già escapati** da aggiungere al set (es. `\\,&`).
 * @param opts.min                 Lunghezza minima; default `1`.
 * @param opts.max                 Lunghezza massima; se omesso, la quantità è esattamente `min`.
 *
 * @returns                        Una `RegExp` con pattern `^[...]{min,max}$` (o `{min}`) e flag `'u'`.
 *
 * @throws Error                   Se non viene selezionato **alcun** gruppo di caratteri (set vuoto).
 *
 * @example
 * // Nome persona: lettere + spazi + trattini + apostrofi, 2–40
 * const nameRx = rx({ letters: true, spaces: true, dashes: true, apostrophes: true, min: 2, max: 40 });
 * nameRx.test("Mario Rossi"); // true
 *
 * @example
 * // Username: lettere + cifre + ._- (no spazi), 3–30
 * const userRx = rx({ letters: true, digits: true, dots: true, underscores: true, dashes: true, min: 3, max: 30 });
 * userRx.test("nino.genco"); // true
 *
 * @notes
 * - Usa `\p{L}`/`\p{Zs}` → richiede ambienti con supporto Unicode nelle regex (TS/JS moderni).
 * - Passa **direttamente** il `RegExp` a `Validators.pattern(...)` in Angular per mantenere il flag `'u'`.
 */
function rx(opts: RxOpts): RegExp {
    const o = opts ?? {};

    const letters = o.letters ?? false;
    const digits = o.digits ?? false;
    const spaces = o.spaces ?? false;
    const dashes = o.dashes ?? false;
    const apostrophes = o.apostrophes ?? false;
    const dots = o.dots ?? false;
    const underscores = o.underscores ?? false;
    const at = o.at ?? false;
    const slashes = o.slashes ?? false;
    const extra = o.extra ?? '';
    const min = o.min ?? 1;
    const max = o.max; // lasciamo undefined se non passato

    const cls = [
        letters && '\\p{L}',
        digits && '0-9',
        spaces && '\\p{Zs}',
        dashes && '\\-',
        apostrophes && "'",
        dots && '\\.',
        underscores && '_',
        at && '@',
        slashes && '/',
        extra || ''
    ].filter((s): s is string => !!s).join('');

    if (!cls) throw new Error('rx(): nessun gruppo di caratteri selezionato.');

    const quant = max != null ? `{${min},${max}}` : `{${min}}`;
    return new RegExp(`^[${cls}]${quant}$`, 'u');
}


/**
 * Preset generici riutilizzabili ovunque.
 * Tutti ritornano RegExp con flag 'u' (Unicode) e ^...$.
 */
export const PATTERNS = {
    /** Solo lettere Unicode (A–Z, accenti, alfabeti non latini). */
    alpha: (min = 1, max?: number) => rx({letters: true, min, max}),

    /** Lettere + spazio (senza newline). */
    alphaSpace: (min = 1, max?: number) => rx({letters: true, spaces: true, min, max}),

    /** Lettere + spazio + trattini/apostrofi (nomi persona internazionali). */
    personName: (minTotal = 3, maxTotal = 30) => {
        const restMin = Math.max(0, minTotal - 1);
        const restMax = Math.max(restMin, maxTotal - 1);
        return new RegExp(`^[A-Z][A-Za-z ]{${restMin},${restMax}}$`);
    },

    /** Alfanumerico (ASCII) compatto. */
    alphaNum: (min = 1, max?: number) => rx({letters: true, digits: true, min, max}),

    /** Alfanumerico + spazio. */
    alphaNumSpace: (min = 1, max?: number) =>
        rx({letters: true, digits: true, spaces: true, min, max}),

    /** Username: lettere+numeri+._- (senza spazi). */
    username: (min = 3, max = 30) =>
        rx({letters: true, digits: true, dots: true, underscores: true, dashes: true, min, max}),

    /** Slug/base “pathlike”: lettere+numeri+-/ (senza spazi). */
    slugPath: (min = 1, max?: number) =>
        rx({letters: true, digits: true, dashes: true, slashes: true, min, max}),

    /** Handle stile social: opzionale @ davanti, poi username. */
    handle: (min = 3, max = 30) =>
        new RegExp(`^@?[\\p{L}0-9._-]{${min},${max}}$`, 'u'),
} as const;
