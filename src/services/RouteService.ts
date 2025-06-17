import RouteClient, {RoutesResponse} from '@/clients/RouteClient';
import Route from '@/types/Route';
import he from 'he'; // Importa la libreria he per il decoding
import RestFilter from '@/types/RestFilter';
import {store} from '@/store';
import {setActiveRoute, setError, setLoading} from '@/store/slices/activeRouteSlice';

class RouteService {
    private routeClient: RouteClient;
    private pendingActiveRouteRequest: Promise<Route | null> | null = null;

    constructor(routeClient: RouteClient) {
        this.routeClient = routeClient;
    }

    async getRoutes(
        page?: number,
        perPage?: number,
        orderby?: string,
        order?: string,
        filters?: RestFilter[]
    ): Promise<RoutesResponse> {
        try {
            let response = await this.routeClient.getRoutes(page, perPage, orderby, order, filters);
            // parse with he decode all the data in the response
            response.data = response.data.map((route) => {
                route.title.rendered = he.decode(route.title.rendered);
                return route;
            });

            return response;
        } catch (error) {
            // In caso di errore
            const errorMessage = error instanceof Error ? error.message : 'Errore durante il recupero dei percorsi';
            console.error(errorMessage);
            throw error;
        }
    }

    async getRoute(id: number): Promise<Route> {
        try {
            // Restituisco direttamente la risposta del client
            let response = await this.routeClient.getRoute(id);
            response.title.rendered = he.decode(response.title.rendered);
            return response;
        } catch (error) {
            // In caso di errore
            const errorMessage = error instanceof Error ? error.message : `Errore durante il recupero del percorso con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async getActiveRoute(): Promise<Route | null> {
        // Verifico se ci sono già dati della route attiva nello store
        const currentActiveRoute = this.getCurrentActiveRoute();

        if (currentActiveRoute) {
            // Restituisco i dati già presenti nello store senza fare una nuova chiamata
            return currentActiveRoute;
        }

        // Se c'è già una richiesta in corso, restituisco quella
        if (this.pendingActiveRouteRequest) {
            return this.pendingActiveRouteRequest;
        }

        try {
            // Imposto lo stato di caricamento
            store.dispatch(setLoading(true));

            // Creo e salvo la Promise
            this.pendingActiveRouteRequest = this.fetchActiveRouteData();
            
            // Attendo la risposta
            const routeData = await this.pendingActiveRouteRequest;
            
            // Rimuovo il riferimento alla richiesta completata
            this.pendingActiveRouteRequest = null;
            
            return routeData;
        } catch (error) {
            // In caso di errore, resetto la richiesta pendente
            this.pendingActiveRouteRequest = null;
            
            // In caso di errore, imposto lo stato di errore
            const errorMessage = error instanceof Error ? error.message : 'Errore durante il recupero della route attiva';
            store.dispatch(setError(errorMessage));
            console.error(errorMessage);
            throw error;
        }
    }

    getCurrentActiveRoute(): Route | null {
        return store.getState().activeRoute.routeData;
    }

    private async fetchActiveRouteData(): Promise<Route | null> {
        // Recupera la route attiva dal client
        let activeRoute = await this.routeClient.getActiveRoute();
        
        // Decodifica i caratteri HTML nel titolo, se presente
        if (activeRoute && activeRoute.title) {
            activeRoute.title.rendered = he.decode(activeRoute.title.rendered);
        }
        
        // Salvo i dati della route attiva nello store
        store.dispatch(setActiveRoute(activeRoute));
        store.dispatch(setLoading(false));
        
        return activeRoute;
    }

    async createRoute(route: Route): Promise<Route> {
        try {
            return await this.routeClient.createRoute(route);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Errore durante la creazione del percorso';
            console.error(errorMessage);
            throw error;
        }
    }

    async updateRoute(id: number, route: Route): Promise<Route> {
        try {
            return await this.routeClient.updateRoute(id, route);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'aggiornamento del percorso con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    async deleteRoute(id: number): Promise<void> {
        try {
            await this.routeClient.deleteRoute(id);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante l'eliminazione del percorso con ID ${id}`;
            console.error(errorMessage);
            throw error;
        }
    }

    /**
     * Disattiva la rotta attualmente attiva.
     * @returns {Promise<void>} - Una promise che si risolve quando la rotta è stata disattivata.
     */
    async deactivateRoute(): Promise<void> {
        try {
            await this.routeClient.deactivateRoute();
            // Rimuovo la route attiva dallo store dopo la disattivazione
            store.dispatch(setActiveRoute(null));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Errore durante la disattivazione della rotta`;
            console.error(errorMessage);
            throw error;
        }
    }
}

export default RouteService;
