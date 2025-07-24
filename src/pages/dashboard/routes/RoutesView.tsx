import PageHeader from '@/components/dashboard/layout/PageHeader';
import Card from '@/components/dashboard/ui/Card';
import Loader from '@/components/dashboard/ui/Loader';
import PageError from '@/components/dashboard/ui/PageError';
import { useServices } from '@/servicesContext';
import Route from '@/types/Route';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeliveriesTable from '@/components/dashboard/table/DeliveriesTable';


const RoutesView: React.FC = () => {
    const { routeService } = useServices();
    const [route, setRoute] = useState<Route | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [refreshIndex, setRefreshIndex] = useState(0);


    useEffect(() => {
        
        const fetchRouteData = async () => {
            try {
                setLoading(true);
                const routeData = await routeService.getActiveRoute();
                setRoute(routeData);                
                setError(null);
            } catch (err) {
                setError('Errore nel caricamento dei dati della rotta');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRouteData();
    }, []);

    const handleDeactivate = async () => {
        if (!route || !route.id) return;
        
        if (window.confirm('Sei sicuro di voler disattivare questa rotta?')) {
            try {
                await routeService.deactivateRoute();
                navigate('/dashboard/routes');
            } catch (err) {
                setError('Errore durante la disattivazione della rotta');
                console.error(err);
            }
        }
    };

    const handleRefresh = () => {
        setRefreshIndex(prev => prev + 1);
    };

    return (
        <div>
            <PageHeader 
                title="Dettagli Rotta"
                actions={
                    <button
                        onClick={handleDeactivate}
                        className="bg-background-800 hover:bg-amber-700 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded"
                        disabled={loading || !route}
                    >
                        Disattiva Rotta
                    </button>
                }
            />

            {loading ? (
                <Loader message="Caricamento dati rotta..." />
            ) : error ? (
                <PageError message={error} type="error" />
            ) : route ? (
                <div className="space-y-6">
                    <Card>
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Informazioni Rotta</h2>
                            <p><strong>Nome:</strong> {route.title.rendered}</p>
                        </div>
                    </Card>
                    
                    <div>
                        <DeliveriesTable
                            routeId={route.id?.toString()}
                            refreshIndex={refreshIndex}
                            onRefresh={handleRefresh}
                            showEditActions={false}
                            showDeleteActions={false}
                            defaultPageSize={100}
                        />
                    </div>
                </div>
            ) : (
                <PageError message="Nessuna rotta attiva trovata" type="info" />
            )}
        </div>
    );
};

export default RoutesView;
