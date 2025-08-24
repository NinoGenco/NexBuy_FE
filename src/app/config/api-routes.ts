import {environment} from "../../environments/environments";


const restApiVersion = '1';
const restApiPrefix = `${environment.apiBaseUrl}/api/v${restApiVersion}`;

type RestId = string | number;


/**
 * Mappa centralizzata degli endpoint API.
 */
export const ApiRoutes = {
    auth: {
        login: () => `${restApiPrefix}/auth/authenticate`,
        logout: () => `${restApiPrefix}/auth/logout`,
        register: () => `${restApiPrefix}/auth/register`,
    },
    users: {
        one: (id: RestId) => `${restApiPrefix}/users/${id}`,
        all: () => `${restApiPrefix}/users`,
        getByUsername: (username: string) => `${restApiPrefix}/user/username/${username}`,
    },
};


/**
 * Mappa tra le API route (endpoint) e il loro `customType` associato,
 * utilizzato nel body delle richieste HTTP per aiutare il backend a
 * identificare il DTO corretto da de-serializzare.
 *
 * La chiave è lo URL della route, mentre il valore è una stringa che
 * rappresenta il tipo personalizzato atteso dal backend.
 *
 * <i>Nota: le chiavi devono essere ottenute invocando le funzioni delle route (es. `ApiRoutes.auth.register()`).</i>
 */
export const ApiRequestCustomTypes: Partial<Record<string, string>> = {
    [ApiRoutes.auth.register()]: 'registration',
    [ApiRoutes.auth.login()]: 'authentication'
}
