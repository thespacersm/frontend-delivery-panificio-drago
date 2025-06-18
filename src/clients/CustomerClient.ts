import RestFilter from '@/types/RestFilter';
import WpClient from './WpClient';
import Customer from '@/types/Customer';

export interface CustomersResponse {
    data: Customer[];
    totalItems: number;
    totalPages: number;
}

/**
 * @class CustomerClient
 * Client per interagire con l'API dei clienti.
 */
class CustomerClient {
    /**
     * @private
     * @property wpClient
     * Istanza di WpClient per effettuare le chiamate HTTP.
     */
    private wpClient: WpClient;
    /**
     * @private
     * @property postType
     * Il tipo di post per i clienti.
     */
    private readonly postType = 'customer';

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
     * @function getCustomers
     * Recupera la lista dei clienti.
     * @param {number} [page] - Il numero di pagina.
     * @param {number} [perPage] - Il numero di elementi per pagina.
     * @param {string} [orderby] - Il campo per ordinare.
     * @param {string} [order] - L'ordine (ascendente o discendente).
     * @param {RestFilter[]} [filters] - Un array opzionale di filtri.
     * @returns {Promise<CustomersResponse>} - Una promise che risolve con la risposta dei clienti.
     */
    async getCustomers(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<CustomersResponse> {
        return await this.wpClient.getPosts(
            this.postType,
            page,
            perPage,
            orderby,
            order,
            filters
        ) as CustomersResponse;
    }

    /**
     * @async
     * @function getCustomer
     * Recupera un singolo cliente dato l'ID.
     * @param {number} id - L'ID del cliente da recuperare.
     * @returns {Promise<Customer>} - Una promise che risolve con il cliente.
     */
    async getCustomer(id: number): Promise<Customer> {
        const response = await this.wpClient.getPost<Customer>(this.postType, id);
        return response.data;
    }

    /**
     * @async
     * @function getCustomersByIds
     * Recupera una lista di clienti dati gli ID.
     * @param {number[]} ids - Un array di ID dei clienti da recuperare.
     * @param {number} [page] - Il numero di pagina.
     * @param {number} [perPage] - Il numero di elementi per pagina.
     * @param {string} [orderby] - Il campo per ordinare.
     * @param {string} [order] - L'ordine (ascendente o discendente).
     * @returns {Promise<CustomersResponse>} - Una promise che risolve con i clienti richiesti e le informazioni di paginazione.
     */
    async getCustomersByIds(
        ids: number[],
        page?: number,
        perPage?: number,
        orderby: string = "id",
        order: string = "asc"
    ): Promise<CustomersResponse> {
        const filters: RestFilter[] = [
            {
                key: 'include',
                value: ids.join(',')
            }
        ];
        return await this.wpClient.getPosts<CustomersResponse>(
            this.postType,
            page || 1,
            perPage || 100,
            orderby,
            order,
            filters
        ) as CustomersResponse;
    }

    /**
     * @async
     * @function createCustomer
     * Crea un nuovo cliente.
     * @param {Customer} customerData - I dati del cliente da creare.
     * @returns {Promise<Customer>} - Una promise che risolve con il cliente creato.
     */
    async createCustomer(customer: Customer): Promise<Customer> {
        const response = await this.wpClient.createPost<Customer>(this.postType, customer);
        return response.data;
    }

    /**
     * @async
     * @function updateCustomer
     * Aggiorna un cliente esistente.
     * @param {number} id - L'ID del cliente da aggiornare.
     * @param {Customer} customerData - I dati del cliente da aggiornare.
     * @returns {Promise<Customer>} - Una promise che risolve con il cliente aggiornato.
     */
    async updateCustomer(id: number, customer: Customer): Promise<Customer> {
        const response = await this.wpClient.updatePost<Customer>(this.postType, id, customer);
        return response.data;
    }

    /**
     * @async
     * @function deleteCustomer
     * Elimina un cliente esistente.
     * @param {number} id - L'ID del cliente da eliminare.
     * @returns {Promise<void>} - Una promise che si risolve quando il cliente è stato eliminato.
     */
    async deleteCustomer(id: number): Promise<void> {
        await this.wpClient.deletePost(this.postType, id);
    }
}

// Export the CustomerClient class
export default CustomerClient;