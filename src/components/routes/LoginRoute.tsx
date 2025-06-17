import React from 'react';
import {Navigate} from 'react-router-dom';
import {useServices} from '@/servicesContext';

interface LoginRouteProps {
    children: React.ReactNode;
}

const LoginRoute: React.FC<LoginRouteProps> = ({children}) => {
    const {authService} = useServices();
    const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const authStatus = await authService.isLoggedIn();
                setIsAuthenticated(authStatus);
            } catch (error) {
                console.error('Errore durante la verifica dell\'autenticazione:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, [authService]);

    // Mostra un loader o nulla mentre verifichiamo l'autenticazione
    if (isAuthenticated === null) {
        return <div>Verifica autenticazione...</div>; // o un componente di loading
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace/>;
    }

    return <>{children}</>;
};

export default LoginRoute;
