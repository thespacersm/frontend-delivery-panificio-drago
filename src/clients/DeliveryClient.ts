import RestFilter from '@/types/RestFilter';
import WpClient from './WpClient';
import Delivery from '@/types/Delivery';
import DeliveryPdfResponse from '@/types/DeliveryPdfResponse';

export interface DeliveriesResponse {
    data: Delivery[];
    totalItems: number;
    totalPages: number;
}

/**
 * @class DeliveryClient
 * Client per interagire con l'API delle consegne.
 */
class DeliveryClient {
    /**
     * @private
     * @property wpClient
     * Istanza di WpClient per effettuare le chiamate HTTP.
     */
    private wpClient: WpClient;
    /**
     * @private
     * @property postType
     * Il tipo di post per le consegne.
     */
    private readonly postType = 'delivery';

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
     * @function getDeliveries
     * Recupera la lista delle consegne.
     * @param {number} [page] - Il numero di pagina.
     * @param {number} [perPage] - Il numero di elementi per pagina.
     * @param {string} [orderby] - Il campo per ordinare.
     * @param {string} [order] - L'ordine (ascendente o discendente).
     * @param {RestFilter[]} [filters] - Un array opzionale di filtri.
     * @returns {Promise<DeliveriesResponse>} - Una promise che risolve con la risposta delle consegne.
     */
    async getDeliveries(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<DeliveriesResponse> {
        return await this.wpClient.getPosts(
            this.postType,
            page,
            perPage,
            orderby,
            order,
            filters
        ) as DeliveriesResponse;
    }

    /**
     * @async
     * @function getDelivery
     * Recupera una singola consegna dato l'ID.
     * @param {number} id - L'ID della consegna da recuperare.
     * @returns {Promise<Delivery>} - Una promise che risolve con la consegna.
     */
    async getDelivery(id: number): Promise<Delivery> {
        const response = await this.wpClient.getPost<Delivery>(this.postType, id);
        return response.data;
    }

    /**
     * @async
     * @function createDelivery
     * Crea una nuova consegna.
     * @param {Delivery} delivery - I dati della consegna da creare.
     * @returns {Promise<Delivery>} - Una promise che risolve con la consegna creata.
     */
    async createDelivery(delivery: Delivery): Promise<Delivery> {
        const response = await this.wpClient.createPost<Delivery>(this.postType, delivery);
        return response.data;
    }

    /**
     * @async
     * @function updateDelivery
     * Aggiorna una consegna esistente.
     * @param {number} id - L'ID della consegna da aggiornare.
     * @param {Delivery} delivery - I dati della consegna da aggiornare.
     * @returns {Promise<Delivery>} - Una promise che risolve con la consegna aggiornata.
     */
    async updateDelivery(id: number, delivery: Delivery): Promise<Delivery> {
        const response = await this.wpClient.updatePost<Delivery>(this.postType, id, delivery);
        return response.data;
    }

    /**
     * @async
     * @function deleteDelivery
     * Elimina una consegna esistente.
     * @param {number} id - L'ID della consegna da eliminare.
     * @returns {Promise<void>} - Una promise che si risolve quando la consegna è stata eliminata.
     */
    async deleteDelivery(id: number): Promise<void> {
        await this.wpClient.deletePost(this.postType, id);
    }

    /**
     * @async
     * @function getDeliveriesByZoneId
     * Recupera le consegne associate a una specifica zona.
     * @param {string} zoneId - L'ID della zona.
     * @param {number} [page] - Il numero di pagina.
     * @param {number} [perPage] - Il numero di elementi per pagina.
     * @param {string} [orderby] - Il campo per ordinare.
     * @param {string} [order] - L'ordine (ascendente o discendente).
     * @param {RestFilter[]} [additionalFilters] - Filtri aggiuntivi da applicare.
     * @returns {Promise<DeliveriesResponse>} - Una promise che risolve con la risposta delle consegne.
     */
    async getDeliveriesByZoneId(
        zoneId: string,
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        additionalFilters?: RestFilter[]
    ): Promise<DeliveriesResponse> {
        const zoneFilter: RestFilter[] = [
            {
                key: 'zone_id',
                value: zoneId
            }
        ];
        
        // Combina il filtro della zona con i filtri aggiuntivi se presenti
        const combinedFilters = additionalFilters 
            ? [...zoneFilter, ...additionalFilters] 
            : zoneFilter;
        
        return await this.getDeliveries(
            page || 1, 
            perPage || 100, 
            orderby || "id", 
            order || "asc", 
            combinedFilters
        );
    }

    /**
     * @async
     * @function generateDeliveryPdf
     * Genera un PDF per una consegna specifica.
     * @param {number} id - L'ID della consegna.
     * @returns {Promise<DeliveryPdfResponse>} - Una promise che risolve con la risposta della generazione del PDF.
     */
    async generateDeliveryPdf(id: number): Promise<DeliveryPdfResponse> {
        const response = await this.wpClient.get<DeliveryPdfResponse>(`/wp-json/seasistemi/v1/pdf/delivery/${id}`);
        return response.data;
    }

    /**
     * @async
     * @function getDeliveriesByRouteId
     * Recupera le consegne associate a una specifica rotta.
     * @param {string} routeId - L'ID della rotta.
     * @param {number} [page] - Il numero di pagina.
     * @param {number} [perPage] - Il numero di elementi per pagina.
     * @param {string} [orderby] - Il campo per ordinare.
     * @param {string} [order] - L'ordine (ascendente o discendente).
     * @param {RestFilter[]} [additionalFilters] - Filtri aggiuntivi da applicare.
     * @returns {Promise<DeliveriesResponse>} - Una promise che risolve con la risposta delle consegne.
     */
    async getDeliveriesByRouteId(
        routeId: string,
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        additionalFilters?: RestFilter[]
    ): Promise<DeliveriesResponse> {
        const routeFilter: RestFilter[] = [
            {
                key: 'route_id',
                value: routeId
            }
        ];
        
        // Combina il filtro della rotta con i filtri aggiuntivi se presenti
        const combinedFilters = additionalFilters 
            ? [...routeFilter, ...additionalFilters] 
            : routeFilter;
        
        return await this.getDeliveries(
            page || 1, 
            perPage || 100, 
            orderby || "id", 
            order || "asc", 
            combinedFilters
        );
    }

    /**
     * @async
     * @function addNote
     * Aggiunge una nota a una consegna specifica.
     * @param {number} deliveryId - L'ID della consegna.
     * @param {string} note - La nota da aggiungere.
     * @returns {Promise<any>} - Una promise che risolve con la risposta dell'aggiunta della nota.
     */
    async addNote(deliveryId: number, note: string): Promise<any> {
        const response = await this.wpClient.post<any>('/wp-json/ts-delivery/v1/add-note', {
            delivery_id: deliveryId,
            note: note
        });
        return response.data;
    }

    /**
     * @async
     * @function togglePrepared
     * Attiva/disattiva lo stato di preparazione di una delivery.
     * @param {number} deliveryId - L'ID della consegna.
     * @param {boolean} isPrepared - Stato di preparazione.
     * @returns {Promise<any>} - Una promise che risolve con la risposta del toggle.
     */
    async togglePrepared(deliveryId: number, isPrepared: boolean): Promise<any> {
        const response = await this.wpClient.post<any>('/wp-json/ts-delivery/v1/toggle-check', {
            delivery_id: deliveryId,
            is_prepared: isPrepared
        });
        return response.data;
    }

    /**
     * @async
     * @function toggleLoaded
     * Attiva/disattiva lo stato di caricamento di una delivery.
     * @param {number} deliveryId - L'ID della consegna.
     * @param {boolean} isLoaded - Stato di caricamento.
     * @returns {Promise<any>} - Una promise che risolve con la risposta del toggle.
     */
    async toggleLoaded(deliveryId: number, isLoaded: boolean): Promise<any> {
        const response = await this.wpClient.post<any>('/wp-json/ts-delivery/v1/toggle-check', {
            delivery_id: deliveryId,
            is_loaded: isLoaded
        });
        return response.data;
    }

    /**
     * @async
     * @function toggleDelivered
     * Attiva/disattiva lo stato di consegna di una delivery.
     * @param {number} deliveryId - L'ID della consegna.
     * @param {boolean} isDelivered - Stato di consegna.
     * @returns {Promise<any>} - Una promise che risolve con la risposta del toggle.
     */
    async toggleDelivered(deliveryId: number, isDelivered: boolean): Promise<any> {
        const response = await this.wpClient.post<any>('/wp-json/ts-delivery/v1/toggle-check', {
            delivery_id: deliveryId,
            is_delivered: isDelivered
        });
        return response.data;
    }
}

export default DeliveryClient;
