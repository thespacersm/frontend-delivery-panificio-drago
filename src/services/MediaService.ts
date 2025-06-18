import MediaClient, { MediaResponse } from '@/clients/MediaClient';
import Media from '@/types/Media';
import he from 'he';
import RestFilter from '@/types/RestFilter';

class MediaService {
    private mediaClient: MediaClient;

    constructor(mediaClient: MediaClient) {
        this.mediaClient = mediaClient;
    }

    async getMedia(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<MediaResponse> {
        try {
            let response = await this.mediaClient.getMedia(page, perPage, orderby, order, filters);
            // Decodifica titoli e altre stringhe HTML
            response.data = response.data.map((media) => {
                media.title.rendered = he.decode(media.title.rendered);
                if (media.description?.rendered) {
                    media.description.rendered = he.decode(media.description.rendered);
                }
                if (media.caption?.rendered) {
                    media.caption.rendered = he.decode(media.caption.rendered);
                }
                return media;
            });

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante il recupero dei media';
            console.error(errorMessage);
            throw error;
        }
    }

    async getMediaItem(id: number): Promise<Media> {
        try {
            let media = await this.mediaClient.getMediaItem(id);
            media.title.rendered = he.decode(media.title.rendered);
            if (media.description?.rendered) {
                media.description.rendered = he.decode(media.description.rendered);
            }
            if (media.caption?.rendered) {
                media.caption.rendered = he.decode(media.caption.rendered);
            }
            return media;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante il recupero del media con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async uploadMedia(file: File, title?: string, caption?: string, altText?: string): Promise<Media> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            if (title) formData.append('title', title);
            if (caption) formData.append('caption', caption);
            if (altText) formData.append('alt_text', altText);
            
            const media = await this.mediaClient.uploadMedia(formData);
            
            // Decodifica il titolo e altre stringhe HTML
            if (media.title?.rendered) {
                media.title.rendered = he.decode(media.title.rendered);
            }
            if (media.description?.rendered) {
                media.description.rendered = he.decode(media.description.rendered);
            }
            if (media.caption?.rendered) {
                media.caption.rendered = he.decode(media.caption.rendered);
            }
            
            return media;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante il caricamento del media';
            console.error(errorMessage);
            throw error;
        }
    }

    async updateMedia(id: number, mediaData: Partial<Media>): Promise<Media> {
        try {
            return await this.mediaClient.updateMedia(id, mediaData);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'aggiornamento del media con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async deleteMedia(id: number): Promise<void> {
        try {
            await this.mediaClient.deleteMedia(id);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'eliminazione del media con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async getMediaByParentId(parentId: number, page?: number, perPage?: number): Promise<MediaResponse> {
        try {
            return await this.mediaClient.getMediaByParentId(parentId, page, perPage);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante il recupero dei media per il parent ID ${parentId}`;
            console.error(errorMessage);
            throw error;
        }
    }
}

export default MediaService;
