
/**
 * Estrae i claims da un token JWT senza verificarne la firma.
 *
 * Decodifica la sezione payload del token (la seconda parte),
 * effettua il decoding da Base64URL e restituisce un oggetto con i claims.
 *
 * Se il token è invalido o non decodificabile, restituisce `null`.
 *
 * @param token Il token JWT da cui estrarre i claims.
 * @returns Un oggetto contenente i claims (`Record<string, any>`), oppure `null` se il parsing fallisce.
 */
export function getClaimsFromToken(token: string): Record<string, any> | null {
    if (!token) return null;

    try {
        const payloadBase64Url = token.split('.')[1];
        const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');

        const payloadJson = decodeURIComponent(
            atob(payloadBase64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(payloadJson);
    } catch (err) {
        console.warn('[AuthService] Failed to decode JWT claims:', err);
        return null;
    }
}
