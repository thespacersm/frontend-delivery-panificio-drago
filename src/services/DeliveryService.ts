import DeliveryClient, {DeliveriesResponse} from '@/clients/DeliveryClient';
import Delivery from '@/types/Delivery';
import DeliveryPdfResponse from '@/types/DeliveryPdfResponse';
import he from 'he';
import RestFilter from '@/types/RestFilter';
import { parseUtils } from '@/utils/parseUtils';

class DeliveryService {
    private deliveryClient: DeliveryClient;

    constructor(deliveryClient: DeliveryClient) {
        this.deliveryClient = deliveryClient;
    }

    async getDeliveries(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<DeliveriesResponse> {
        try {
            let response = await this.deliveryClient.getDeliveries(page, perPage, orderby, order, filters);
            // parse with he decode all the data in the response
            response.data = response.data.map((delivery) => {
                delivery.title.rendered = he.decode(delivery.title.rendered);
                return delivery;
            });

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante il recupero delle consegne';
            console.error(errorMessage);
            throw error;
        }
    }

    async getDelivery(id: number): Promise<Delivery> {
        try {
            let response = await this.deliveryClient.getDelivery(id);
            response.title.rendered = he.decode(response.title.rendered);
            response.content.rendered = parseUtils.stripHtmlTags(he.decode(response.content.rendered));
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante il recupero della consegna con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async createDelivery(delivery: Delivery): Promise<Delivery> {
        try {
            return await this.deliveryClient.createDelivery(delivery);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante la creazione della consegna';
            console.error(errorMessage);
            throw error;
        }
    }

    async updateDelivery(id: number, delivery: Delivery): Promise<Delivery> {
        try {
            return await this.deliveryClient.updateDelivery(id, delivery);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'aggiornamento della consegna con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async deleteDelivery(id: number): Promise<void> {
        try {
            await this.deliveryClient.deleteDelivery(id);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'eliminazione della consegna con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async getDeliveriesByZoneId(
        zoneId: string,
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<DeliveriesResponse> {
        try {
            let response = await this.deliveryClient.getDeliveriesByZoneId(
                zoneId,
                page,
                perPage,
                orderby,
                order,
                filters
            );
            // parse with he decode all the data in the response
            response.data = response.data.map((delivery) => {
                delivery.title.rendered = he.decode(delivery.title.rendered);
                return delivery;
            });

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante il recupero delle consegne per la zona ${zoneId}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async getDeliveriesByRouteId(
        routeId: string,
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<DeliveriesResponse> {
        try {
            let response = await this.deliveryClient.getDeliveriesByRouteId(
                routeId,
                page,
                perPage,
                orderby,
                order,
                filters
            );
            // parse with he decode all the data in the response
            response.data = response.data.map((delivery) => {
                delivery.title.rendered = he.decode(delivery.title.rendered);
                return delivery;
            });

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante il recupero delle consegne per la rotta ${routeId}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async generateDeliveryPdf(id: number): Promise<DeliveryPdfResponse> {
        try {
            return await this.deliveryClient.generateDeliveryPdf(id);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante la generazione del PDF per la consegna con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }
}

export default DeliveryService;
