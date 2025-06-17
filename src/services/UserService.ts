import UserClient, {RolesResponse, UserResponse} from '@/clients/UserClient';
import User from '@/types/User';
import {store} from '@/store';
import {setError, setLoading, setUserData} from '@/store/slices/userSlice';
import UserFactory from '@/factories/UserFactory';
import { rolePermissions } from '@/acl';

class UserService {
    private userClient: UserClient;
    private pendingUserRequest: Promise<User> | null = null;

    constructor(userClient: UserClient) {
        this.userClient = userClient;
    }

    async getUser(): Promise<User> {
        // Verifico se ci sono già dati utente nello store
        const currentUser = this.getCurrentUser();

        if (currentUser) {
            // Restituisco i dati già presenti nello store senza fare una nuova chiamata
            return currentUser;
        }

        // Se c'è già una richiesta in corso, restituisco quella
        if (this.pendingUserRequest) {
            return this.pendingUserRequest;
        }

        try {
            // Imposto lo stato di caricamento
            store.dispatch(setLoading(true));

            // Creo e salvo la Promise
            this.pendingUserRequest = this.fetchUserData();
            
            // Attendo la risposta
            const userData = await this.pendingUserRequest;
            
            // Rimuovo il riferimento alla richiesta completata
            this.pendingUserRequest = null;
            
            return userData;
        } catch (error) {
            // In caso di errore, resetto la richiesta pendente
            this.pendingUserRequest = null;
            
            // In caso di errore, imposto lo stato di errore
            const errorMessage = error instanceof Error ? error.message : 'Errore durante il recupero dei dati utente';
            store.dispatch(setError(errorMessage));
            throw error;
        }
    }


    getCurrentUser(): User | null {
        return store.getState().user.userData;
    }

    async hasPermission(permission: string): Promise<boolean> {
        const currentUser = await this.getUser();

        if (!currentUser || !currentUser.roles || currentUser.roles.length === 0) {
            return false;
        }

        // Verifica se uno qualsiasi dei ruoli dell'utente ha il permesso richiesto
        return currentUser.roles.some(role => {
            const permissions = rolePermissions[role];
            return permissions && permissions.includes(permission);
        });
    }

    /**
     * Cambia la password dell'utente corrente
     * @param password La nuova password
     * @param repeatPassword La conferma della nuova password
     * @throws Error se le password non coincidono o se la chiamata API fallisce
     */
    async changePassword(password: string, repeatPassword: string): Promise<void> {
        if (password !== repeatPassword) {
            throw new Error('Le password non coincidono');
        }
        
        try {
            await this.userClient.changePassword(password, repeatPassword);
        } catch (error) {
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Errore durante il cambio della password';
            throw new Error(errorMessage);
        }
    }

    private async fetchUserData(): Promise<User> {
        // Ottengo i dati dell'utente
        const userResponse: UserResponse = await this.userClient.getUser();
        const rolesResponse: RolesResponse = await this.userClient.getRoles();
        
        // Utilizzo la factory per convertire le risposte in un oggetto User
        const userData: User = UserFactory.createFromResponses(userResponse, rolesResponse);

        // Salvo i dati dell'utente nello store
        store.dispatch(setUserData(userData));
        store.dispatch(setLoading(false));

        return userData;
    }

}

export default UserService;