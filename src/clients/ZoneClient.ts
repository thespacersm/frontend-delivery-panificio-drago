import RestFilter from '@/types/RestFilter';
import WpClient from './WpClient';
import Zone from '@/types/Zone';

export interface ZonesResponse {
    data: Zone[];
    totalItems: number;
    totalPages: number;
}

/**
 * @class ZoneClient
 * Client per interagire con l'API delle zone.
 */
class ZoneClient {
    /**
     * @private
     * @property wpClient
     * Istanza di WpClient per effettuare le chiamate HTTP.
     */
    private wpClient: WpClient;
    /**
     * @private
     * @property postType
     * Il tipo di post per le zone.
     */
    private readonly postType = 'zone';

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
     * @function getZones
     * Recupera la lista delle zone.
     * @param {number} [page] - Il numero di pagina.
     * @param {number} [perPage] - Il numero di elementi per pagina.
     * @param {string} [orderby] - Il campo per ordinare.
     * @param {string} [order] - L'ordine (ascendente o discendente).
     * @param {RestFilter[]} [filters] - Un array opzionale di filtri.
     * @returns {Promise<ZonesResponse>} - Una promise che risolve con la risposta delle zone.
     */
    async getZones(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<ZonesResponse> {
        return await this.wpClient.getPosts(
            this.postType,
            page,
            perPage,
            orderby,
            order,
            filters
        ) as ZonesResponse;
    }

    /**
     * @async
     * @function getZone
     * Recupera una singola zona dato l'ID.
     * @param {number} id - L'ID della zona da recuperare.
     * @returns {Promise<Zone>} - Una promise che risolve con la zona.
     */
    async getZone(id: number): Promise<Zone> {
        const response = await this.wpClient.getPost<Zone>(this.postType, id);
        return response.data;
    }

    /**
     * @async
     * @function createZone
     * Crea una nuova zona.
     * @param {Zone} zone - I dati della zona da creare.
     * @returns {Promise<Zone>} - Una promise che risolve con la zona creata.
     */
    async createZone(zone: Zone): Promise<Zone> {
        const response = await this.wpClient.createPost<Zone>(this.postType, zone);
        return response.data;
    }

    /**
     * @async
     * @function updateZone
     * Aggiorna una zona esistente.
     * @param {number} id - L'ID della zona da aggiornare.
     * @param {Zone} zone - I dati della zona da aggiornare.
     * @returns {Promise<Zone>} - Una promise che risolve con la zona aggiornata.
     */
    async updateZone(id: number, zone: Zone): Promise<Zone> {
        const response = await this.wpClient.updatePost<Zone>(this.postType, id, zone);
        return response.data;
    }

    /**
     * @async
     * @function deleteZone
     * Elimina una zona esistente.
     * @param {number} id - L'ID della zona da eliminare.
     * @returns {Promise<void>} - Una promise che si risolve quando la zona è stata eliminata.
     */
    async deleteZone(id: number): Promise<void> {
        await this.wpClient.deletePost(this.postType, id);
    }
}

export default ZoneClient;
