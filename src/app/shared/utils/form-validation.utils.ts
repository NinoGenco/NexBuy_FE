import {
    AbstractControl,
    AsyncValidatorFn,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidatorFn,
} from '@angular/forms';


/**
 * Config di un singolo campo del form.
 * - validators: lista di ValidatorFn sincroni (Angular o custom).
 * - asyncValidators: lista di ValidatorFn asincroni (opzionale).
 * - updateOn: quando validare (default: 'change').
 * - normalize: funzione di "sanitizzazione" del valore prima di inviarlo al backend (es. trim, lowercase).
 */
export type FieldSpec = {
    validators: ValidatorFn[];
    asyncValidators?: AsyncValidatorFn[];
    updateOn?: 'change' | 'blur' | 'submit';
    normalize?: (raw: any) => any;
};

/**
 * Collezione di campi => specifica completa del form.
 * Usa come chiave il nome del controllo (es. 'firstName', 'email', ...).
 */
export type FormSpec<TFieldKey extends string = string> = Record<TFieldKey, FieldSpec>;


/* ──────────────────────────────────────────────────────────────────────────── *
 *                            UTILITY FUNCTIONS                                 *
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Costruisce un FormGroup a partire da una FormSpec.
 * Non vincola il tipo dei valori per restare generico; se preferisci, tipizza i singoli FormControl.
 */
export function buildFormGroup<TFieldKey extends string>(
    fb: FormBuilder,
    spec: FormSpec<TFieldKey>
): FormGroup {
    const controls: Record<string, FormControl> = {};

    for (const key of Object.keys(spec) as TFieldKey[]) {
        const cfg = spec[key];
        controls[key] = new FormControl('', {
            validators: cfg.validators,
            asyncValidators: cfg.asyncValidators,
            updateOn: cfg.updateOn ?? 'change',
        });
    }

    return fb.group(controls);
}

/**
 * Applica (se presenti) le funzioni di normalizzazione definite nella FormSpec
 * restituendo un oggetto pronto per il submit.
 */
export function sanitizePayload<T extends Record<string, any>>(
    raw: T,
    spec: FormSpec
): T {
    const out: any = {};
    for (const [k, v] of Object.entries(raw)) {
        const norm = spec[k as keyof typeof spec]?.normalize;
        out[k] = typeof norm === 'function' ? norm(v) : v;
    }
    return out as T;
}


/* ──────────────────────────────────────────────────────────────────────────── *
 *                             MESSAGGI ERRORE                                  *
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Contesto passato ai formatter dei messaggi di errore.
 * - label: etichetta utente del campo (es. "Email", "Nome", ...).
 * - control: il FormControl che ha generato l'errore (può servire per casi speciali).
 */
export type ErrorContext = { label: string; control: AbstractControl };

/**
 * Firma di un formatter di messaggi di errore.
 * - error: oggetto errore del validator (es. minlength => { requiredLength, actualLength }).
 * - ctx: contesto con label e control.
 * Deve restituire il testo da mostrare all'utente.
 */
export type MessageFormatter = (error: any, ctx: ErrorContext) => string;

/**
 * Mappa di messaggi di default per i validator più comuni di Angular.
 * Puoi sovrascrivere le chiavi con `mergeMessages` o passare `overrides` a `errorsOf`/`firstError`.
 */
export const DEFAULT_MESSAGES: Record<string, MessageFormatter> = {
    required: (_e, {label}) =>
        `Il campo '${label}' è obbligatorio.`,
    requiredTrue: (_e, {label}) =>
        `Il campo '${label}' deve essere selezionato.`,
    email: (_e) =>
        `La mail non è valida.`,
    minlength: (e, {label}) =>
        `Il campo '${label}' deve contenere almeno ${e?.requiredLength} caratteri`
        + (e?.actualLength != null ? ` (attuali: ${e.actualLength})` : '') + '.',
    maxlength: (e, {label}) =>
        `Il campo '${label}' può contenere al massimo ${e?.requiredLength} caratteri`
        + (e?.actualLength != null ? ` (attuali: ${e.actualLength})` : '') + '.',
    min: (e, {label}) =>
        `Il campo '${label}' deve contenere un valore ≥ ${e?.min}`
        + (e?.actual != null ? ` (valore: ${e.actual})` : '') + '.',
    max: (e, {label}) =>
        `Il campo '${label}' deve contenere un valore ≤ ${e?.max}`
        + (e?.actual != null ? ` (valore: ${e.actual})` : '') + '.',
    pattern: (_e, {label}) =>
        `Il campo '${label}' non rispetta il formato richiesto.`,

    default: (_e, {label}) =>
        `Il campo '${label}' non è valido.`,
};

/** Unisce i messaggi di default con degli override (senza mutare i default). */
export function mergeMessages(
    overrides?: Partial<Record<string, MessageFormatter>>
): Record<string, MessageFormatter> {
    const merged: Record<string, MessageFormatter> = {...DEFAULT_MESSAGES};

    if (overrides) {
        for (const [k, v] of Object.entries(overrides)) {
            if (typeof v === 'function') {
                merged[k] = v;
            }
        }
    }
    return merged;
}

/**
 * Restituisce TUTTI i messaggi di errore di un control, in base alla label del campo.
 * - control: FormControl (o AbstractControl) da cui leggere gli errori.
 * - fieldLabel: etichetta utente (es. "Email"). Passala tra virgolette nel template.
 * - overrides: formatter opzionali (es. per errori custom come 'usernameTaken').
 */
export function errorsOf(
    control: AbstractControl | null,
    fieldLabel: string,
    overrides?: Partial<Record<string, MessageFormatter>>
): string[] {
    if (!control || !control.errors) return [];
    const map = mergeMessages(overrides);
    const ctx: ErrorContext = { label: fieldLabel, control };

    return Object.entries(control.errors).map(([key, err]) => {
        const normalizedKey = key.toLowerCase();
        const fmt =
            (map as any)[normalizedKey] || (map as any)[key] || map['default'];
        return fmt(err, ctx);
    });
}

/** Restituisce SOLO il primo messaggio di errore (comodo nel template). */
export function firstError(
    control: AbstractControl | null,
    fieldLabel: string,
    overrides?: Partial<Record<string, MessageFormatter>>
): string | null {
    const all = errorsOf(control, fieldLabel, overrides);
    return all.length ? all[0] : null;
}
