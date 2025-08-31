import {environment} from "../../environments/environments";


const restApiVersion = '1';
const restApiPrefix = `${environment.apiBaseUrl}/api/v${restApiVersion}`;


/** Mappa centralizzata degli endpoint API. */
export const ApiTemplates = {
    auth: {
        login: '/auth/authenticate',
        logout: '/auth/logout',
        register: '/auth/register',
    },
    users: {
        one: '/users/:id',
        all: '/users',
        getByUsername: '/user/username/:username',
        update: '/user/update/:username',
        updatePassword: '/user/update-password/:username',
    },
} as const;

const allTemplates: string[] = Object.values(ApiTemplates)
    .flatMap(group => Object.values(group));


export const ApiRoutes = {
    auth: {
        login: () => withPrefix(ApiTemplates.auth.login),
        logout: () => withPrefix(ApiTemplates.auth.logout),
        register: () => withPrefix(ApiTemplates.auth.register),
    },
    users: {
        one: (id: string | number) => buildUrl(ApiTemplates.users.one, {id}),
        all: () => withPrefix(ApiTemplates.users.all),
        getByUsername: (username: string) => buildUrl(ApiTemplates.users.getByUsername, {username}),
        update: (username: string) => buildUrl(ApiTemplates.users.update, {username}),
        updatePassword: (username: string) => buildUrl(ApiTemplates.users.updatePassword, {username}),
    },
} as const;


/**
 * Mappa tra le API route (endpoint) e il loro `customType` associato,
 * utilizzato nel body delle richieste HTTP per aiutare il backend a
 * identificare il DTO corretto da de-serializzare.
 *
 * La chiave è lo URL della route, mentre il valore è una stringa che
 * rappresenta il tipo personalizzato atteso dal backend.
 *
 * <i>Nota: le chiavi devono essere ottenute invocando le funzioni delle route
 * (es. `ApiRoutes.auth.register()`).</i>
 */
export const ApiRequestCustomTypes: Partial<Record<string, string>> = {
    [ApiTemplates.auth.register]: 'registration',
    [ApiTemplates.auth.login]: 'authentication',
    [ApiTemplates.users.update]: 'update_user',
    [ApiTemplates.users.updatePassword]: 'update_password',
}

const compiledTemplates = allTemplates.map(tpl => ({ tpl, re: patternFromTemplate(tpl) }));


// ---------------------------------------------------------------------------------------------------------------------

function normalizePath(p: string): string {
    // un solo leading slash, niente trailing slash (tranne la root)
    if (!p) return '/';
    const once = '/' + p.replace(/^\/+/, '');
    const trimmed = once.replace(/\/+$/, '');
    return trimmed || '/';
}

function stripPrefix(pathname: string, fullPrefixUrl: string): string {
    // estrae solo la parte path dal prefisso (ignora host, protocollo ecc.)
    const prefixPath = new URL(fullPrefixUrl).pathname;

    if (pathname.startsWith(prefixPath)) {
        const stripped = pathname.slice(prefixPath.length);
        return stripped.startsWith('/') ? stripped : '/' + stripped;
    }

    return pathname; // se non matcha, lo ritorna intero
}

function escapeRegexExceptParamsAndSlash(s: string): string {
    // Escapa tutto tranne / e : (che poi rimpiazziamo)
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, m => (m === '/' ? '/' : (m === ':' ? ':' : `\\${m}`)));
}

function patternFromTemplate(tpl: string): RegExp {
    const body = escapeRegexExceptParamsAndSlash(normalizePath(tpl))
        .replace(/:[A-Za-z0-9_]+/g, '[^/]+'); // :param -> segmento
    // consenti eventuale trailing slash nell’URL
    return new RegExp(`^${body}/?$`, 'i');
}

/**
 * Prepone un prefisso REST (es. "/api/v1") a un path relativo (es. "/users").
 *
 * Assunzioni:
 * - `restApiPrefix` NON termina con "/" (es. "/api/v1")
 * - `path` INIZIA con "/" (es. "/users")
 *
 * @param path Path relativo che inizia con "/".
 * @returns L'URL risultante con prefisso, es. "/api/v1/users".
 *
 * @example
 * const restApiPrefix = '/api/v1';
 * withPrefix('/users'); // => "/api/v1/users"
 */
function withPrefix(path: string) {
    return `${restApiPrefix}${path}`;
}

/**
 * Costruisce un URL a partire da un template con placeholder in stile `:param`
 * (es. "/users/:id") sostituendoli con i valori passati in `params` e
 * URL-encodandoli. Infine antepone il prefisso tramite `withPrefix`.
 *
 * Placeholder supportati: sequenze alfanumeriche e underscore dopo i due punti
 * (es. :id, :username, :user_id).
 *
 * Nota: se un placeholder non è presente in `params`, verrà sostituito con
 * la stringa "undefined". In tal caso conviene validare `params` a monte.
 *
 * @param tpl Template del path, es. "/users/:id".
 * @param params Mappa nome→valore dei placeholder, es. { id: 42 }.
 * @returns URL completo con prefisso, es. "/api/v1/users/42".
 *
 * @example
 * const restApiPrefix = '/api/v1';
 * buildUrl('/user/username/:username', { username: 'm.rossi' });
 * // => "/api/v1/user/username/m.rossi"
 */
function buildUrl(tpl: string, params: Record<string, string | number> = {}) {
    const filled = tpl.replace(/:([A-Za-z0-9_]+)/g, (_, k) =>
        encodeURIComponent(String(params[k]))
    );
    return withPrefix(filled);
}

/**
 * Ricava il template originale (con placeholder) a partire da un URL concreto.
 *
 * Funziona confrontando il `pathname` dell'URL (con `restApiPrefix` rimosso)
 * contro tutti i template noti (`allTemplates`), sostituendo ogni `:param`
 * con una regex `[^/]+` e ancorando inizio/fine riga.
 *
 * Esempio:
 * - URL:     "/api/v1/user/username/m.rossi"
 * - Template corrispondente: "/user/username/:username"
 *
 * @param url URL assoluto o relativo (es. "http://host/api/v1/x" o "/api/v1/x").
 * @returns Il template corrispondente (es. "/user/username/:username") o `undefined`.
 *
 * @example
 * const restApiPrefix = '/api/v1';
 * const allTemplates = ['/users', '/users/:id', '/user/username/:username'];
 * templateFromUrl('/api/v1/user/username/m.rossi'); // => "/user/username/:username"
 */
export function templateFromUrl(url: string): string | undefined {
    const u = new URL(url, window.location.origin);
    const pathNoPrefix = stripPrefix(u.pathname, restApiPrefix);

    for (const { tpl, re } of compiledTemplates) {
        if (re.test(normalizePath(pathNoPrefix))) return tpl;
    }
    return undefined;
}

/**
 * Restituisce il `customType` associato a un URL, usando la mappa
 * `ApiRequestCustomTypes` indicizzata per template (non per URL concreto).
 *
 * Flusso:
 * 1) `templateFromUrl(url)` → trova il template corrispondente.
 * 2) Cerca `ApiRequestCustomTypes[template]` → ritorna il tipo, se definito.
 *
 * @param url URL assoluto o relativo.
 * @returns Il `customType` (string) oppure `undefined` se non mappato.
 *
 * @example
 * // ApiRequestCustomTypes = {
 * //   '/auth/register': 'registration',
 * //   '/user/update/:username': 'user-update'
 * // }
 * customTypeFromUrl('/api/v1/user/update/m.rossi'); // => "user-update"
 */
export function customTypeFromUrl(url: string): string | undefined {
    const template = templateFromUrl(url);
    return template ? ApiRequestCustomTypes[template] : undefined;
}
