import React, {useEffect, useState} from 'react';
import {useServices} from '@/servicesContext';
import User from '@/types/User';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faUser, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Route from '@/types/Route';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({toggleSidebar}) => {
    const {userService, authService, routeService} = useServices();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [activeRoute, setActiveRoute] = useState<Route | null>(null);
    const [routeLoading, setRouteLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userService.getUser();
                setUser(userData);
                setLoading(false);
            } catch (err) {
                console.error('Errore nel recupero dati utente:', err);
                setError('Impossibile caricare i dati utente');
                setLoading(false);
            }
        };

        fetchUser();
    }, [userService]);

    useEffect(() => {
        const fetchActiveRoute = async () => {
            try {
                setRouteLoading(true);
                const route = await routeService.getActiveRoute();
                setActiveRoute(route);
            } catch (err) {
                console.error('Errore nel recupero della rotta attiva:', err);
            } finally {
                setRouteLoading(false);
            }
        };

        fetchActiveRoute();
    }, [routeService]);

    const handleLogout = () => {
        authService.logout();
        // Redirect alla pagina di login dopo il logout
        window.location.href = '/login';
    };

    // Chiude il dropdown quando si clicca al di fuori
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.getElementById('user-dropdown');
            const button = document.getElementById('user-menu-button');
            if (dropdown && button &&
                !dropdown.contains(event.target as Node) &&
                !button.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-boxwhite-100 shadow-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none mr-4 cursor-pointer"
                            aria-label="Toggle sidebar"
                        >
                            <FontAwesomeIcon icon={faBars} size="lg"/>
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Sezione Rotta Attiva */}
                        <div className="flex items-center">
                            {routeLoading ? (
                                <div className="flex items-center text-gray-600">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2"/>
                                    <span className="hidden md:inline">Caricamento rotta...</span>
                                </div>
                            ) : activeRoute ? (
                                <Link to="/dashboard/routes/current" className="flex items-center text-green-600 hover:text-green-700">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2"/>
                                    <span className="hidden md:inline">Rotta attiva</span>
                                </Link>
                            ) : (
                                <div className="flex items-center text-gray-600">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2"/>
                                    <span className="hidden md:inline">Rotta non attiva</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Dropdown Utente */}
                        <div className="ml-3 relative">
                            <div>
                                <button
                                    id="user-menu-button"
                                    className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 p-2 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    {loading ? (
                                        <span className="hidden sm:inline">Caricamento...</span>
                                    ) : error ? (
                                        <span className="hidden sm:inline">Utente</span>
                                    ) : (
                                        <>
                                            <span className="hidden md:inline">Ciao, {user?.name || 'Utente'}</span>
                                            <FontAwesomeIcon icon={faUser} className="md:invisible"/>
                                        </>
                                    )}
                                </button>
                            </div>
                            {/* Dropdown menu */}
                            {dropdownOpen && (
                                <div
                                    id="user-dropdown"
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1"
                                >
                                    <Link
                                        to="/dashboard/settings"
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Impostazioni
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
