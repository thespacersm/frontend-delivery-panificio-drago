import RestFilter from '@/types/RestFilter';
import WpClient from './WpClient';
import Media from '@/types/Media';

export interface MediaResponse {
    data: Media[];
    totalItems: number;
    totalPages: number;
}

/**
 * @class MediaClient
 * Client per interagire con l'API dei media.
 */
class MediaClient {
    /**
     * @private
     * @property wpClient
     * Istanza di WpClient per effettuare le chiamate HTTP.
     */
    private wpClient: WpClient;
    
    /**
     * @private
     * @property postType
     * Il tipo di post per i media.
     */
    private readonly postType = 'media';

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
     * @function getMedia
     * Recupera la lista dei media.
     * @param {number} [page] - Il numero di pagina.
     * @param {number} [perPage] - Il numero di elementi per pagina.
     * @param {string} [orderby] - Il campo per ordinare.
     * @param {string} [order] - L'ordine (ascendente o discendente).
     * @param {RestFilter[]} [filters] - Un array opzionale di filtri.
     * @returns {Promise<MediaResponse>} - Una promise che risolve con la risposta dei media.
     */
    async getMedia(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<MediaResponse> {
        return await this.wpClient.getPosts(
            this.postType,
            page,
            perPage,
            orderby,
            order,
            filters
        ) as MediaResponse;
    }

    /**
     * @async
     * @function getMediaItem
     * Recupera un singolo media dato l'ID.
     * @param {number} id - L'ID del media da recuperare.
     * @returns {Promise<Media>} - Una promise che risolve con il media.
     */
    async getMediaItem(id: number): Promise<Media> {
        const response = await this.wpClient.getPost<Media>(this.postType, id);
        return response.data;
    }

    /**
     * @async
     * @function uploadMedia
     * Carica un nuovo file media.
     * @param {FormData} formData - FormData contenente il file e i metadati.
     * @returns {Promise<Media>} - Una promise che risolve con il media caricato.
     */
    async uploadMedia(formData: FormData): Promise<Media> {
        const response = await this.wpClient.uploadFile<Media>(formData);
        return response.data;
    }

    /**
     * @async
     * @function updateMedia
     * Aggiorna i metadati di un media esistente.
     * @param {number} id - L'ID del media da aggiornare.
     * @param {Partial<Media>} media - I dati del media da aggiornare.
     * @returns {Promise<Media>} - Una promise che risolve con il media aggiornato.
     */
    async updateMedia(id: number, media: Partial<Media>): Promise<Media> {
        const response = await this.wpClient.updatePost<Media>(this.postType, id, media);
        return response.data;
    }

    /**
     * @async
     * @function deleteMedia
     * Elimina un media esistente.
     * @param {number} id - L'ID del media da eliminare.
     * @returns {Promise<void>} - Una promise che si risolve quando il media è stato eliminato.
     */
    async deleteMedia(id: number): Promise<void> {
        await this.wpClient.deletePost(this.postType, id);
    }

    /**
     * @async
     * @function getMediaByParentId
     * Recupera i media associati a un post specifico.
     * @param {number} parentId - L'ID del post genitore.
     * @param {number} [page] - Il numero di pagina.
     * @param {number} [perPage] - Il numero di elementi per pagina.
     * @returns {Promise<MediaResponse>} - Una promise che risolve con la risposta dei media.
     */
    async getMediaByParentId(
        parentId: number,
        page?: number,
        perPage?: number
    ): Promise<MediaResponse> {
        const filters: RestFilter[] = [
            {
                key: 'parent',
                value: parentId.toString()
            }
        ];
        
        return await this.getMedia(
            page || 1,
            perPage || 100,
            'date',
            'desc',
            filters
        );
    }
}

export default MediaClient;
