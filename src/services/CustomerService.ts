import CustomerClient, {CustomersResponse} from '@/clients/CustomerClient';
import he from 'he'; // Importa la libreria he per il decoding
import RestFilter from '@/types/RestFilter';
import Customer from '@/types/Customer';

class CustomerService {
    private customerClient: CustomerClient;

    constructor(customerClient: CustomerClient) {
        this.customerClient = customerClient;
    }

    async getCustomers(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<CustomersResponse> {
        try {
            
            let response = await this.customerClient.getCustomers(page, perPage, orderby, order, filters);
            // parse with he decode all the data in the response
            response.data = response.data.map((customer) => {
                customer.title.rendered = he.decode(customer.title.rendered);
                return customer;
            });

            return response;
        } catch (error) {
            // In caso di errore
            const errorMessage = error instanceof Error ? error.message : 'Errore durante il recupero dei clienti';
            console.error(errorMessage);
            throw error;
        }
    }

    async getCustomer(id: number): Promise<Customer> {
        try {
            // Restituisco direttamente la risposta del client
            let response = await this.customerClient.getCustomer(id);
            response.title.rendered = he.decode(response.title.rendered);
            return response;
        } catch (error) {
            // In caso di errore
            const errorMessage = error instanceof Error ? error.message : `Errore durante il recupero del cliente con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async getCustomersByIds(ids: number[]): Promise<Customer[]> {
        try {
            let customers = await this.customerClient.getCustomersByIds(ids);
            // Decodifica i titoli HTML per tutti i clienti
            customers = customers.map((customer) => {
                customer.title.rendered = he.decode(customer.title.rendered);
                return customer;
            });
            return customers;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante il recupero dei clienti';
            console.error(errorMessage);
            throw error;
        }
    }

    async createCustomer(customer: Customer): Promise<Customer> {
        try {
            return await this.customerClient.createCustomer(customer);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante la creazione del cliente';
            console.error(errorMessage);
            throw error;
        }
    }

    async updateCustomer(id: number, customer: Customer): Promise<Customer> {
        try {
            return await this.customerClient.updateCustomer(id, customer);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'aggiornamento del cliente con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async deleteCustomer(id: number): Promise<void> {
        try {
            await this.customerClient.deleteCustomer(id);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'eliminazione del cliente con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }
}

export default CustomerService;