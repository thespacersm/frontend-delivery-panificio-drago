import RestFilter from '@/types/RestFilter';
import WpClient from './WpClient';
import Vehicle from '@/types/Vehicle';

export interface VehiclesResponse {
    data: Vehicle[];
    totalItems: number;
    totalPages: number;
}

/**
 * @class VehicleClient
 * Client per interagire con l'API dei veicoli.
 */
class VehicleClient {
    /**
     * @private
     * @property wpClient
     * Istanza di WpClient per effettuare le chiamate HTTP.
     */
    private wpClient: WpClient;
    /**
     * @private
     * @property postType
     * Il tipo di post per i veicoli.
     */
    private readonly postType = 'vehicle';

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
     * @function getVehicles
     * Recupera la lista dei veicoli.
     * @param {number} [page] - Il numero di pagina.
     * @param {number} [perPage] - Il numero di elementi per pagina.
     * @param {string} [orderby] - Il campo per ordinare.
     * @param {string} [order] - L'ordine (ascendente o discendente).
     * @param {RestFilter[]} [filters] - Un array opzionale di filtri.
     * @returns {Promise<VehiclesResponse>} - Una promise che risolve con la risposta dei veicoli.
     */
    async getVehicles(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<VehiclesResponse> {
        return await this.wpClient.getPosts(
            this.postType,
            page,
            perPage,
            orderby,
            order,
            filters
        ) as VehiclesResponse;
    }

    /**
     * @async
     * @function getVehicle
     * Recupera un singolo veicolo dato l'ID.
     * @param {number} id - L'ID del veicolo da recuperare.
     * @returns {Promise<Vehicle>} - Una promise che risolve con il veicolo.
     */
    async getVehicle(id: number): Promise<Vehicle> {
        const response = await this.wpClient.getPost<Vehicle>(this.postType, id);
        return response.data;
    }

    /**
     * @async
     * @function createVehicle
     * Crea un nuovo veicolo.
     * @param {Vehicle} vehicle - I dati del veicolo da creare.
     * @returns {Promise<Vehicle>} - Una promise che risolve con il veicolo creato.
     */
    async createVehicle(vehicle: Vehicle): Promise<Vehicle> {
        const response = await this.wpClient.createPost<Vehicle>(this.postType, vehicle);
        return response.data;
    }

    /**
     * @async
     * @function updateVehicle
     * Aggiorna un veicolo esistente.
     * @param {number} id - L'ID del veicolo da aggiornare.
     * @param {Vehicle} vehicle - I dati del veicolo da aggiornare.
     * @returns {Promise<Vehicle>} - Una promise che risolve con il veicolo aggiornato.
     */
    async updateVehicle(id: number, vehicle: Vehicle): Promise<Vehicle> {
        const response = await this.wpClient.updatePost<Vehicle>(this.postType, id, vehicle);
        return response.data;
    }

    /**
     * @async
     * @function deleteVehicle
     * Elimina un veicolo esistente.
     * @param {number} id - L'ID del veicolo da eliminare.
     * @returns {Promise<void>} - Una promise che si risolve quando il veicolo è stato eliminato.
     */
    async deleteVehicle(id: number): Promise<void> {
        await this.wpClient.deletePost(this.postType, id);
    }
}

// Export the VehicleClient class
export default VehicleClient;
