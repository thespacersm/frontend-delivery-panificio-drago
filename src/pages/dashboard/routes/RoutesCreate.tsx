import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useServices} from '@/servicesContext';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import PageError from '@/components/dashboard/ui/PageError';
import Card from '@/components/dashboard/ui/Card';
import RoutesForm from '@/components/dashboard/form/RoutesForm';
import Vehicle from '@/types/Vehicle';
import Zone from '@/types/Zone';
import Route from '@/types/Route';

const RoutesCreate: React.FC = () => {
    const {routeService, vehicleService, zoneService} = useServices();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [vehiclesResponse, zonesResponse] = await Promise.all([
                    vehicleService.getVehicles(1, 100),
                    zoneService.getZones(1, 100)
                ]);
                setVehicles(vehiclesResponse.data);
                setZones(zonesResponse.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Errore nel caricamento dei dati');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [vehicleService, zoneService]);

    const handleSubmit = async (route: Route) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await routeService.createRoute(route);
            // Redirect alla lista dei percorsi dopo la creazione
            navigate('/dashboard/routes', {state: {message: 'Percorso creato con successo!'}});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Si è verificato un errore durante la creazione del percorso');
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <PageHeader title="Nuova rotta"/>

            {error && <PageError message={error}/>}

            <div className="w-full md:max-w-1/2">
                <Card>
                    {!isLoading && (
                        <RoutesForm 
                            onSubmit={handleSubmit} 
                            isSubmitting={isSubmitting} 
                            vehicles={vehicles}
                            zones={zones}
                        />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default RoutesCreate;
