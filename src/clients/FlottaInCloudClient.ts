import FlottaInCloudDevice from '@/types/flottaincloud/FlottaInCloudDevice';
import FlottaInCloudPositionResponse from '@/types/flottaincloud/FlottaInCloudPositionResponse';
import axios, {AxiosInstance} from 'axios';


/**
 * @class FlottaInCloudClient
 * Client per interagire con l'API di Flotta In Cloud.
 */
class FlottaInCloudClient {
    /**
     * @private
     * @property client
     * Istanza di Axios per effettuare le chiamate HTTP.
     */
    private client: AxiosInstance;
    /**
     * @private
     * @property username
     * Username per l'autenticazione.
     */
    private username: string;
    /**
     * @private
     * @property token
     * Token per l'autenticazione.
     */
    private token: string;

    /**
     * @constructor
     * Inizializza il client con la base URL, username e token.
     * @param {string} baseUrl - La base URL dell'API.
     * @param {string} username - L'username per l'autenticazione.
     * @param {string} token - Il token per l'autenticazione.
     */
    constructor(baseUrl: string, username: string, token: string) {
        this.username = username;
        this.token = token;
        this.client = axios.create({
            baseURL: baseUrl,
            headers: {
                'Authorization': this.getAuthHeader(),
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * @private
     * @function getAuthHeader
     * Genera l'header di autorizzazione.
     * @returns {string} - L'header di autorizzazione.
     */
    private getAuthHeader(): string {
        // Utilizziamo btoa() invece di Buffer.from() per la compatibilità con il browser
        const credentials = btoa(`${this.username}:${this.token}`);
        return `Basic ${credentials}`;
    }

    /**
     * @async
     * @function getDevices
     * Recupera la lista dei dispositivi.
     * @returns {Promise<FlottaInCloudDevice[]>} - Una promise che risolve con un array di dispositivi.
     */
    async getDevices(): Promise<FlottaInCloudDevice[]> {
        try {
            const response = await this.client.get<FlottaInCloudDevice[]>('/external_api/v1/devices');
            return response.data;
        } catch (error) {
            console.error('Error fetching devices:', error);
            throw error;
        }
    }

    /**
     * @async
     * @function getDevice
     * Recupera un singolo dispositivo dato l'IMEI.
     * @param {string} imei - L'IMEI del dispositivo da recuperare.
     * @returns {Promise<FlottaInCloudDevice>} - Una promise che risolve con il dispositivo.
     */
    async getDevice(imei: string): Promise<FlottaInCloudDevice> {
        try {
            const response = await this.client.get<FlottaInCloudDevice>(`/external_api/v1/device/${imei}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching device with IMEI ${imei}:`, error);
            throw error;
        }
    }

    /**
     * @async
     * @function getHistoryPositions
     * Recupera lo storico delle posizioni per un dato dispositivo.
     * @param {string} imei - L'IMEI del dispositivo.
     * @param {Date} startDate - La data di inizio.
     * @param {Date} endDate - La data di fine.
     * @param {number[]} [filterType] - Un array opzionale di tipi di filtro.
     * @param {number} [limit=1000] - Il limite dei risultati.
     * @param {number} [skip=0] - Il numero di risultati da saltare.
     * @returns {Promise<FlottaInCloudPositionResponse>} - Una promise che risolve con la risposta delle posizioni.
     */
    async getHistoryPositions(
        imei: string,
        startDate: Date,
        endDate: Date,
        filterType?: number[],
        limit: number = 1000,
        skip: number = 0
    ): Promise<FlottaInCloudPositionResponse> {
        try {
            // Conversione delle date in timestamp (ms)
            const startTimestamp = startDate.getTime();
            const endTimestamp = endDate.getTime();

            // Parametri per la richiesta
            const params: Record<string, any> = {
                start: startTimestamp,
                stop: endTimestamp,
                limit: limit,
                skip: skip
            };

            // Aggiungi parametri opzionali se forniti
            if (filterType && filterType.length > 0) {
                params.filter_type = filterType.join(',');
            }

            const response = await this.client.get<FlottaInCloudPositionResponse>(
                `/external_api/v1/positionsHistory/${imei}`,
                {params}
            );

            return response.data;
        } catch (error) {
            console.error(`Error fetching position history for IMEI ${imei}:`, error);
            throw error;
        }
    }
}

// Export the FlottaInCloudClient class
export default FlottaInCloudClient;
