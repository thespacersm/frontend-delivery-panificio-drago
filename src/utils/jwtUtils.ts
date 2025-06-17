interface JwtPayload {
    exp?: number;

    [key: string]: any;
}

/**
 * Decodifica un token JWT senza verifica della firma
 * @param token Il token JWT da decodificare
 * @returns Il payload del token o null se il token non è valido
 */
export const decodeJwt = (token: string): JwtPayload | null => {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Errore nella decodifica del JWT', error);
        return null;
    }
};

/**
 * Verifica se un token JWT è scaduto
 * @param token Il token JWT da verificare
 * @returns true se il token è valido e non scaduto, false altrimenti
 */
export const isTokenValid = (token: string): boolean => {
    if (!token) return false;

    const payload = decodeJwt(token);
    if (!payload) return false;

    // Verifica scadenza token
    if (payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
    }

    return false;
};
