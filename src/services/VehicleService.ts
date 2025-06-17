import VehicleClient, {VehiclesResponse} from '@/clients/VehicleClient';
import Vehicle from '@/types/Vehicle';
import he from 'he'; // Importa la libreria he per il decoding
import RestFilter from '@/types/RestFilter';

class VehicleService {
    private vehicleClient: VehicleClient;

    constructor(vehicleClient: VehicleClient) {
        this.vehicleClient = vehicleClient;
    }

    async getVehicles(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<VehiclesResponse> {
        try {
            
            let response = await this.vehicleClient.getVehicles(page, perPage, orderby, order, filters);
            // parse with he decode all the data in the response
            response.data = response.data.map((vehicle) => {
                vehicle.title.rendered = he.decode(vehicle.title.rendered);
                return vehicle;
            });

            return response;
        } catch (error) {
            // In caso di errore
            const errorMessage = error instanceof Error ? error.message : 'Errore durante il recupero dei veicoli';
            console.error(errorMessage);
            throw error;
        }
    }

    async getVehicle(id: number): Promise<Vehicle> {
        try {
            // Restituisco direttamente la risposta del client
            let response = await this.vehicleClient.getVehicle(id);
            response.title.rendered = he.decode(response.title.rendered);
            return response;
        } catch (error) {
            // In caso di errore
            const errorMessage = error instanceof Error ? error.message : `Errore durante il recupero del veicolo con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async createVehicle(vehicle: Vehicle): Promise<Vehicle> {
        try {
            return await this.vehicleClient.createVehicle(vehicle);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante la creazione del veicolo';
            console.error(errorMessage);
            throw error;
        }
    }

    async updateVehicle(id: number, vehicle: Vehicle): Promise<Vehicle> {
        try {
            return await this.vehicleClient.updateVehicle(id, vehicle);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'aggiornamento del veicolo con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async deleteVehicle(id: number): Promise<void> {
        try {
            await this.vehicleClient.deleteVehicle(id);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'eliminazione del veicolo con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }
}

export default VehicleService;
