import ZoneClient, {ZonesResponse} from '@/clients/ZoneClient';
import Zone from '@/types/Zone';
import he from 'he';
import RestFilter from '@/types/RestFilter';

class ZoneService {
    private zoneClient: ZoneClient;

    constructor(zoneClient: ZoneClient) {
        this.zoneClient = zoneClient;
    }

    async getZones(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<ZonesResponse> {
        try {
            let response = await this.zoneClient.getZones(page, perPage, orderby, order, filters);
            // parse with he decode all the data in the response
            response.data = response.data.map((zone) => {
                zone.title.rendered = he.decode(zone.title.rendered);
                return zone;
            });

            return response;
        } catch (error) {
            // In caso di errore
            const errorMessage = error instanceof Error ? error.message : 'Errore durante il recupero delle zone';
            console.error(errorMessage);
            throw error;
        }
    }

    async getZone(id: number): Promise<Zone> {
        try {
            // Restituisco direttamente la risposta del client
            let response = await this.zoneClient.getZone(id);
            response.title.rendered = he.decode(response.title.rendered);
            return response;
        } catch (error) {
            // In caso di errore
            const errorMessage = error instanceof Error ? error.message : `Errore durante il recupero della zona con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async createZone(zone: Zone): Promise<Zone> {
        try {
            return await this.zoneClient.createZone(zone);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante la creazione della zona';
            console.error(errorMessage);
            throw error;
        }
    }

    async updateZone(id: number, zone: Zone): Promise<Zone> {
        try {
            return await this.zoneClient.updateZone(id, zone);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'aggiornamento della zona con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async deleteZone(id: number): Promise<void> {
        try {
            await this.zoneClient.deleteZone(id);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'eliminazione della zona con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }
}

export default ZoneService;
