import FlottaInCloudClient from '@/clients/FlottaInCloudClient';
import FlottaInCloudDevice from '@/types/flottaincloud/FlottaInCloudDevice';
import FlottaInCloudPosition from '@/types/flottaincloud/FlottaInCloudPosition';

class FlottaInCloudService {
    private flottaInCloudClient: FlottaInCloudClient;

    constructor(flottaInCloudClient: FlottaInCloudClient) {
        this.flottaInCloudClient = flottaInCloudClient;
    }

    async getDevices(): Promise<FlottaInCloudDevice[]> {
        return await this.flottaInCloudClient.getDevices();
    }

    async getDevice(imei: string): Promise<FlottaInCloudDevice> {
        return await this.flottaInCloudClient.getDevice(imei);
    }

    async getHistoryPositions(
        imei: string,
        startDate: Date,
        endDate: Date,
        filterType?: number[],
        limit: number = 1000,
        skip: number = 0
    ): Promise<FlottaInCloudPosition[]> {
        // Array per raccogliere tutti i risultati
        let allPositions: FlottaInCloudPosition[] = [];
        let hasMore = true;
        let currentSkip = skip;

        // Continua a richiedere dati finché "has_more" è true
        while (hasMore) {
            const response = await this.flottaInCloudClient.getHistoryPositions(
                imei,
                startDate,
                endDate,
                filterType,
                limit,
                currentSkip
            );

            // Aggiungi i dati ricevuti all'array dei risultati
            if (Array.isArray(response.data)) {
                allPositions = [...allPositions, ...response.data];
            }

            // Controlla se ci sono altri dati da recuperare
            hasMore = response.has_more;

            // Se ci sono altri dati, aggiorna lo skip per la prossima richiesta
            if (hasMore) {
                currentSkip += limit;
            }
        }

        return allPositions;
    }
}

export default FlottaInCloudService;
