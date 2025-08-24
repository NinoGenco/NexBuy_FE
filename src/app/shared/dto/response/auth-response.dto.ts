/** Risposta restituita dall'endpoint di autenticazione dopo un login riuscito. */
export interface AuthResponseDto {
  /** Token JWT utilizzato per effettuare richieste autenticate */
  token: string;
}
