import React, {useEffect, useState} from 'react';
import {Outlet, Link} from 'react-router-dom';
import Header from '@/components/dashboard/layout/Header';
import Sidebar from '@/components/dashboard/layout/Sidebar';
import Can from '@/components/dashboard/permission/Can';
import {acl} from '@/acl';
import {useServices} from '@/servicesContext';
import Route from '@/types/Route';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faMapMarkerAlt} from '@fortawesome/free-solid-svg-icons';

const DashboardLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [activeRoute, setActiveRoute] = useState<Route | null>(null);
    const [routeLoading, setRouteLoading] = useState<boolean>(true);
    const {routeService} = useServices();

    useEffect(() => {
        const handleResize = () => {
            // Apre automaticamente la sidebar su desktop
            setSidebarOpen(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row">
            {/* Overlay con effetto blur per chiudere sidebar su mobile */}
            {sidebarOpen && window.innerWidth < 768 && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[5] md:hidden"
                    onClick={closeSidebar}
                    aria-label="Chiudi sidebar"
                />
            )}

            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>

            <div className={`flex-1 flex flex-col transition-all relative ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                <Header toggleSidebar={toggleSidebar}/>
                <main className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 pb-26 lg:px-8">
                    <Outlet/>
                </main>
                
                {/* Pulsante di aggiunta in basso a destra */}
                <Can permission={acl.ROUTE_CREATE}>
                    <Link 
                        to={activeRoute ? "/dashboard/routes/current" : "/dashboard/routes/new"}
                        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full ${activeRoute ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary-700'} text-white shadow-lg flex items-center justify-center text-3xl cursor-pointer transition-colors z-10`}
                        aria-label={activeRoute ? "Visualizza percorso attivo" : "Aggiungi percorso"}
                    >
                        {routeLoading ? (
                            <span className="animate-pulse">...</span>
                        ) : (
                            <FontAwesomeIcon icon={activeRoute ? faMapMarkerAlt : faPlus} className="w-7 h-7" />
                        )}
                    </Link>
                </Can>
            </div>
        </div>
    );
};

export default DashboardLayout;
