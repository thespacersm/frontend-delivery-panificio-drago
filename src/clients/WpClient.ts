import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {store} from '@/store';
import RestFilter from '@/types/RestFilter';
import Post from '@/types/Post';

export interface PostsResponse {
    data: Post[];
    totalItems: number;
    totalPages: number;
}

/**
 * @class WpClient
 * Client per interagire con le API di WordPress.
 */
class WpClient {
    /**
     * @private
     * @property client
     * Istanza di Axios per effettuare le chiamate HTTP.
     */
    private client: AxiosInstance;

    /**
     * @constructor
     * Inizializza il client con una base URL.
     * @param {string} baseUrl - La base URL per l'API.
     */
    constructor(baseUrl: string) {
        this.client = axios.create({
            baseURL: baseUrl
        });
    }

    /**
     * @private
     * @function getAuthHeader
     * Metodo per ottenere l'header di autorizzazione.
     * @returns {object} - L'header di autorizzazione.
     */
    private getAuthHeader() {
        const token = store.getState().auth.token;
        return token ? {'Authorization': `Bearer ${token}`} : {};
    }

    /**
     * @private
     * @function handleApiError
     * Metodo helper per gestire gli errori di autorizzazione.
     * @param {any} error - L'errore da gestire.
     */
    private handleApiError(error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
            let errorMessage = error.response.data?.message || 'Richiesta non valida';
            throw new Error(errorMessage);
        }
        if (axios.isAxiosError(error) && error.response?.status === 403) {
            throw new Error("Non sei autorizzato ad eseguire l'azione");
        }
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            throw new Error("Risorsa non trovata");
        }
        throw error;
    }

    /**
     * @async
     * @function get
     * Metodo per effettuare una richiesta GET.
     * @param {string} endpoint - L'endpoint da chiamare.
     * @param {Record<string, any>} [params] - I parametri della richiesta.
     * @returns {Promise<any>} - Una promise che risolve con la risposta.
     */
    async get<T>(endpoint: string, params?: Record<string, any>) {
        try {
            return await this.client.get<T>(endpoint, {
                params,
                headers: this.getAuthHeader()
            });
        } catch (error) {
            this.handleApiError(error);
            throw error; // Non dovrebbe mai arrivare qui, ma TypeScript lo richiede
        }
    }

    /**
     * @async
     * @function post
     * Metodo per effettuare una richiesta POST.
     * @param {string} endpoint - L'endpoint da chiamare.
     * @param {any} [data] - I dati da inviare.
     * @returns {Promise<any>} - Una promise che risolve con la risposta.
     */
    async post<T>(endpoint: string, data?: any) {
        try {
            return await this.client.post<T>(endpoint, data, {
                headers: this.getAuthHeader()
            });
        } catch (error) {
            this.handleApiError(error);
            throw error;
        }
    }

    /**
     * @async
     * @function put
     * Metodo per effettuare una richiesta PUT.
     * @param {string} endpoint - L'endpoint da chiamare.
     * @param {any} [data] - I dati da inviare.
     * @returns {Promise<any>} - Una promise che risolve con la risposta.
     */
    async put<T>(endpoint: string, data?: any) {
        try {
            return await this.client.put<T>(endpoint, data, {
                headers: this.getAuthHeader()
            });
        } catch (error) {
            this.handleApiError(error);
            throw error;
        }
    }

    /**
     * @async
     * @function delete
     * Metodo per effettuare una richiesta DELETE.
     * @param {string} endpoint - L'endpoint da chiamare.
     * @returns {Promise<any>} - Una promise che risolve con la risposta.
     */
    async delete<T>(endpoint: string) {
        try {
            return await this.client.delete<T>(endpoint, {
                headers: this.getAuthHeader()
            });
        } catch (error) {
            this.handleApiError(error);
            throw error;
        }
    }

    /**
     * @async
     * @function getPosts
     * Metodo generico per ottenere posts di qualsiasi tipo.
     * @param {string} postType - Il tipo di post da recuperare.
     * @param {number} [page] - Il numero di pagina.
     * @param {number} [perPage] - Il numero di elementi per pagina.
     * @param {string} [orderby] - Il campo per ordinare.
     * @param {string} [order] - L'ordine (ascendente o discendente).
     * @param {RestFilter[]} [filters] - Un array opzionale di filtri.
     * @returns {Promise<PostsResponse>} - Una promise che risolve con la risposta dei posts.
     */
    async getPosts<PostsResponse>(
        postType: string,
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string, // 'asc' o 'desc'
        filters?: RestFilter[]
    ): Promise<PostsResponse> {
        const queryParams: Record<string, string> = {};

        // Imposta parametri di paginazione
        if (page) queryParams.page = page.toString();
        if (perPage) queryParams.per_page = perPage.toString();

        // Imposta parametri di ordinamento
        if (orderby) {
            // Lista dei valori standard di orderby di WordPress
            const standardOrderbyValues = ['none', 'rand', 'id', 'title', 'slug', 'modified', 'parent', 'menu_order', 'comment_count', 'date'];

            if (standardOrderbyValues.includes(orderby)) {
                // Se è un valore standard, usa direttamente orderby
                queryParams.orderby = orderby;
            } else {
                // Altrimenti, usa meta_value con meta_key
                queryParams.orderby = 'meta_value';
                queryParams.meta_key = orderby;
            }
        }
        if (order) queryParams.order = order;

        // Aggiungi eventuali filtri personalizzati
        if (filters && filters.length > 0) {
            filters.forEach(filter => {
                // Gestione casi speciali dei filtri
                if (filter.key === 'id') {
                    // Per l'id utilizziamo il parametro "include"
                    queryParams.include = filter.value;
                } else if (filter.key === 'title') {
                    // Per il title utilizziamo il parametro "search"
                    queryParams.search = filter.value;
                } else if (filter.key === 'include') {
                    queryParams.include = filter.value; // Include specific IDs
                } else {
                    // Gestione standard dei filtri
                    queryParams[`meta_value_${filter.key}`] = filter.value;

                    // Aggiungi il tipo se specificato
                    if (filter.type) {
                        queryParams[`meta_type_${filter.key}`] = filter.type;
                    }

                    if (filter.compare) {
                        queryParams[`meta_compare_${filter.key}`] = filter.compare;
                    }
                }
            });
        }

        try {
            // Ora otteniamo l'intera risposta, non solo i dati
            const response = await this.client.get<PostsResponse>(`/wp-json/wp/v2/${postType}`, {
                params: queryParams,
                headers: this.getAuthHeader()
            });

            return {
                data: response.data,
                totalItems: parseInt(response.headers['x-wp-total'] || '0', 10),
                totalPages: parseInt(response.headers['x-wp-totalpages'] || '0', 10)
            } as PostsResponse;
        } catch (error) {
            this.handleApiError(error);
            throw error;
        }
    }

    /**
     * @async
     * @function getPost
     * Metodo per ottenere un singolo post.
     * @param {string} postType - Il tipo di post da recuperare.
     * @param {number} id - L'ID del post da recuperare.
     * @returns {Promise<AxiosResponse<T>>} - Una promise che risolve con la risposta del post.
     */
    async getPost<T>(postType: string, id: number): Promise<AxiosResponse<T>> {
        try {
            return await this.get<T>(`/wp-json/wp/v2/${postType}/${id}`);
        } catch (error) {
            this.handleApiError(error);
            throw error;
        }
    }

    /**
     * @async
     * @function createPost
     * Metodo per creare un nuovo post.
     * @param {string} postType - Il tipo di post da creare.
     * @param {any} data - I dati del post da creare.
     * @returns {Promise<AxiosResponse<T>>} - Una promise che risolve con la risposta del post creato.
     */
    async createPost<T>(postType: string, data: any): Promise<AxiosResponse<T>> {
        try {
            return await this.post<T>(`/wp-json/wp/v2/${postType}`, data);
        } catch (error) {
            this.handleApiError(error);
            throw error;
        }
    }

    /**
     * @async
     * @function updatePost
     * Metodo per aggiornare un post.
     * @param {string} postType - Il tipo di post da aggiornare.
     * @param {number} id - L'ID del post da aggiornare.
     * @param {any} data - I dati del post da aggiornare.
     * @returns {Promise<AxiosResponse<T>>} - Una promise che risolve con la risposta del post aggiornato.
     */
    async updatePost<T>(postType: string, id: number, data: any): Promise<AxiosResponse<T>> {
        try {
            return await this.put<T>(`/wp-json/wp/v2/${postType}/${id}`, data);
        } catch (error) {
            this.handleApiError(error);
            throw error;
        }
    }

    /**
     * @async
     * @function deletePost
     * Metodo per eliminare un post.
     * @param {string} postType - Il tipo di post da eliminare.
     * @param {number} id - L'ID del post da eliminare.
     * @returns {Promise<void>} - Una promise che si risolve quando il post è stato eliminato.
     */
    async deletePost(postType: string, id: number): Promise<void> {
        try {
            await this.delete(`/wp-json/wp/v2/${postType}/${id}`);
        } catch (error) {
            this.handleApiError(error);
            throw error;
        }
    }
}

// Export the WpClient class
export default WpClient;
