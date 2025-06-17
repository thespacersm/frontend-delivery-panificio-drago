import Post from './Post';


/**
 * Interfaccia che rappresenta un percorso (route) nel sistema
 */
interface Route extends Post {
    acf: {
        internal_vehicle: boolean;
        vehicle_id: string;
        plate: string;
        date: string;
        active: boolean;
        zone_id: string;
    }
}

export default Route;