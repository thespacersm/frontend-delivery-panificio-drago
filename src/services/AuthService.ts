import AuthClient from '@/clients/AuthClient';
import {store} from '@/store';
import {logout, setToken} from '@/store/slices/authSlice';
import {clearUser} from '@/store/slices/userSlice';
import {isTokenValid} from '@/utils/jwtUtils';

class AuthService {
    private authClient: AuthClient;

    constructor(authClient: AuthClient) {
        this.authClient = authClient;
    }

    async login(username: string, password: string): Promise<string> {
        try {
            const response = await this.authClient.login(username, password);

            // Salva il token nello store
            store.dispatch(setToken(response.token));

            return response.token;
        } catch (error) {
            throw error;
        }
    }

    getToken(): string | null {
        return store.getState().auth.token;
    }

    logout(): void {
        // Dispatch delle action per pulire lo state
        store.dispatch(logout());
        store.dispatch(clearUser());
    }

    async isLoggedIn(): Promise<boolean> {
        const token = this.getToken();

        if (!token) {
            return false;
        }

        return isTokenValid(token);
    }
}

export default AuthService;