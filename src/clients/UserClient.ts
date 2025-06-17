import WpClient from './WpClient';

export interface UserResponse {
    id: number;
    name: string;
    url: string;
    description: string;
    link: string;
    slug: string;
    avatar_urls: {
        '24': string;
        '48': string;
        '96': string;
    };
    meta: any[];
}

export interface RolesResponse {
    roles: string[];
}

export interface ChangePasswordParams {
    password: string;
    repeatPassword: string;
}

/**
 * @class UserClient
 * Client per interagire con l'API degli utenti.
 */
class UserClient {
    /**
     * @private
     * @property wpClient
     * Istanza di WpClient per effettuare le chiamate HTTP.
     */
    private wpClient: WpClient;

    /**
     * @constructor
     * Inizializza il client con un'istanza di WpClient.
     * @param {WpClient} wpClient - L'istanza di WpClient.
     */
    constructor(wpClient: WpClient) {
        this.wpClient = wpClient;
    }

    /**
     * @async
     * @function getUser
     * Recupera l'utente corrente.
     * @returns {Promise<UserResponse>} - Una promise che risolve con l'utente.
     */
    async getUser(): Promise<UserResponse> {
        const response = await this.wpClient.get<UserResponse>('/wp-json/wp/v2/users/me');
        return response.data;
    }

    /**
     * @async
     * @function getRoles
     * Recupera i ruoli dell'utente corrente.
     * @returns {Promise<RolesResponse>} - Una promise che risolve con i ruoli.
     */
    async getRoles(): Promise<RolesResponse> {
        const response = await this.wpClient.get<RolesResponse>('/wp-json/wp/v2/users/me/roles');
        return response.data;
    }

    /**
     * @async
     * @function changePassword
     * Reimposta la password dell'utente corrente.
     * @param {string} password - La nuova password.
     * @param {string} repeatPassword - La ripetizione della nuova password.
     * @returns {Promise<void>} - Una promise che si risolve quando la password è stata cambiata.
     */
    async changePassword(password: string, repeatPassword: string): Promise<void> {
        await this.wpClient.post(
            '/wp-json/ts-rest-change-password/v1/change-password',
            {
                password,
                repeatPassword
            }
        );
        // Non ritorniamo la risposta poiché non ci interessa
    }
}

// Export the UserClient class
export default UserClient;