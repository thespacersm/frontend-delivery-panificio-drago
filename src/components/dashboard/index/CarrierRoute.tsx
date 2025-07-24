import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Card from '@/components/dashboard/ui/Card';
import {useServices} from '@/servicesContext';
import Route from '@/types/Route';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMapMarkerAlt, faPlus} from '@fortawesome/free-solid-svg-icons';

const CarrierRoute: React.FC = () => {
    const [activeRoute, setActiveRoute] = useState<Route | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const {routeService} = useServices();

    useEffect(() => {
        const fetchActiveRoute = async () => {
            try {
                setLoading(true);
                const route = await routeService.getActiveRoute();
                setActiveRoute(route);
            } catch (err) {
                console.error('Errore nel recupero della rotta attiva:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchActiveRoute();
    }, [routeService]);

    if (loading) {
        return (
            <Card>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-primary" />
                        Percorso di Consegna
                    </h3>
                    {activeRoute ? (
                        <div>
                            <p className="text-sm text-gray-600 mb-3">
                                Percorso attivo: <span className="font-medium">{activeRoute.title.rendered}</span>
                            </p>
                            <Link
                                to="/dashboard/routes/current"
                                className="inline-flex items-center px-4 py-2 bg-primary hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                            >
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                Vai al percorso
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-600 mb-3">
                                Nessun percorso attivo al momento
                            </p>
                            <Link
                                to="/dashboard/routes/new"
                                className="inline-flex items-center px-4 py-2 bg-primary hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors"
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Crea percorso
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default CarrierRoute;
