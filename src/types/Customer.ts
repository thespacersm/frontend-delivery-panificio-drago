import Post from "./Post";

/**
 * Interfaccia che rappresenta un customer (cliente) nel sistema
 */
interface Customer extends Post {
    acf: {
        email: string;
        sea_code: string;
        address_name: string;
        address_street: string;
        address_location: string;
        address_zip: string;
        address_province: string;
    };
}

export default Customer;