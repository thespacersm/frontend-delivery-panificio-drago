import RestFilter from '@/types/RestFilter';
import WpClient from './WpClient';
import Route from '@/types/Route';
import axios from 'axios';

export interface RoutesResponse {
    data: Route[];
    totalItems: number;
    totalPages: number;
}

/**
 * @class RouteClient
 * Client per interagire con l'API delle rotte.
 */
class RouteClient {
    /**
     * @private
     * @property wpClient
     * Istanza di WpClient per effettuare le chiamate HTTP.
     */
    private wpClient: WpClient;
    /**
     * @private
     * @property postType
     * Il tipo di post per le rotte.
     */
    private readonly postType = 'route';

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
     * @function getRoutes
     * Recupera la lista delle rotte.
     * @param {number} [page] - Il numero di pagina.
     * @param {number} [perPage] - Il numero di elementi per pagina.
     * @param {string} [orderby] - Il campo per ordinare.
     * @param {string} [order] - L'ordine (ascendente o discendente).
     * @param {RestFilter[]} [filters] - Un array opzionale di filtri.
     * @returns {Promise<RoutesResponse>} - Una promise che risolve con la risposta delle rotte.
     */
    async getRoutes(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<RoutesResponse> {
        return await this.wpClient.getPosts(
            this.postType,
            page,
            perPage,
            orderby,
            order,
            filters
        ) as RoutesResponse;
    }

    /**
     * @async
     * @function getRoute
     * Recupera una singola rotta dato l'ID.
     * @param {number} id - L'ID della rotta da recuperare.
     * @returns {Promise<Route>} - Una promise che risolve con la rotta.
     */
    async getRoute(id: number): Promise<Route> {
        const response = await this.wpClient.getPost<Route>(this.postType, id);
        return response.data;
    }

    /**
     * @async
     * @function createRoute
     * Crea una nuova rotta.
     * @param {Route} route - I dati della rotta da creare.
     * @returns {Promise<Route>} - Una promise che risolve con la rotta creata.
     */
    async createRoute(route: Route): Promise<Route> {
        const response = await this.wpClient.createPost<Route>(this.postType, route);
        return response.data;
    }

    /**
     * @async
     * @function updateRoute
     * Aggiorna una rotta esistente.
     * @param {number} id - L'ID della rotta da aggiornare.
     * @param {Route} route - I dati della rotta da aggiornare.
     * @returns {Promise<Route>} - Una promise che risolve con la rotta aggiornata.
     */
    async updateRoute(id: number, route: Route): Promise<Route> {
        const response = await this.wpClient.updatePost<Route>(this.postType, id, route);
        return response.data;
    }

    /**
     * @async
     * @function deleteRoute
     * Elimina una rotta esistente.
     * @param {number} id - L'ID della rotta da eliminare.
     * @returns {Promise<void>} - Una promise che si risolve quando la rotta è stata eliminata.
     */
    async deleteRoute(id: number): Promise<void> {
        await this.wpClient.deletePost(this.postType, id);
    }

    /**
     * @async
     * @function getActiveRoute
     * Recupera la rotta attualmente attiva.
     * @returns {Promise<Route | null>} - Una promise che risolve con la rotta attiva o null se non esiste.
     */
    async getActiveRoute(): Promise<Route | null> {
        try {
            const response = await this.wpClient.get<Route>('/wp-json/ts-route/v1/active-route');
            return response.data;
        } catch (error) {
            // Se riceviamo un 404, significa che non c'è una rotta attiva
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            // Altrimenti propaghiamo l'errore
            throw error;
        }
    }

    /**
     * @async
     * @function deactivateRoute
     * Disattiva la rotta attualmente attiva.
     * @returns {Promise<void>} - Una promise che si risolve quando la rotta è stata disattivata.
     */
    async deactivateRoute(): Promise<void> {
        await this.wpClient.get('/wp-json/ts-route/v1/deactivate-route');
    }
}

// Export the RouteClient class
export default RouteClient;
