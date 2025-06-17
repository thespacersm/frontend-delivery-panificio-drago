import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useServices} from '@/servicesContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const {authService} = useServices();
    const location = useLocation();
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

    if (!isAuthenticated) {
        // Reindirizza al login, mantenendo l'URL originale come state per reindirizzare dopo il login
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
