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
  },
  users: {
    one: (id: RestId) => `${restApiPrefix}/users/${id}`,
    all: () => `${restApiPrefix}/users`,
  },
};
