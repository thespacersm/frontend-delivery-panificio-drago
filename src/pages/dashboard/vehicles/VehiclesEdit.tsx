import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useServices} from '@/servicesContext';
import VehiclesForm from '@/components/dashboard/form/VehiclesForm';
import Vehicle from '@/types/Vehicle';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import PageError from '@/components/dashboard/ui/PageError';
import Card from '@/components/dashboard/ui/Card';
import Loader from '@/components/dashboard/ui/Loader';
import Can from '@/components/dashboard/permission/Can';
import { acl } from '@/acl';

const VehiclesEdit: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {vehicleService} = useServices();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);

    useEffect(() => {
        const loadVehicle = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const data = await vehicleService.getVehicle(Number(id));
                setVehicle(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : `Si è verificato un errore durante il recupero del veicolo con ID ${id}`);
            } finally {
                setIsLoading(false);
            }
        };

        loadVehicle();
    }, [id, vehicleService]);

    const handleSubmit = async (vehicle: Vehicle) => {
        if (!id) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await vehicleService.updateVehicle(Number(id), vehicle);
            // Redirect alla lista dei veicoli dopo l'aggiornamento
            navigate('/dashboard/vehicles', {state: {message: 'Veicolo aggiornato con successo!'}});
        } catch (err) {
            setError(err instanceof Error ? err.message : `Si è verificato un errore durante l'aggiornamento del veicolo con ID ${id}`);
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !vehicle) return;
        
        if (window.confirm(`Sei sicuro di voler eliminare il veicolo con targa ${vehicle.acf?.plate || id}?`)) {
            try {
                setIsLoading(true);
                await vehicleService.deleteVehicle(Number(id));
                navigate('/dashboard/vehicles', {
                    state: { message: 'Veicolo eliminato con successo!' }
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 
                    `Si è verificato un errore durante l'eliminazione del veicolo con ID ${id}`);
                setIsLoading(false);
            }
        }
    };

    if (isLoading) {
        return <Loader/>;
    }

    if (error) {
        return <PageError message={error}/>;
    }

    if (!vehicle) {
        return <PageError message="Veicolo non trovato" type="warning"/>;
    }

    return (
        <div>
            <PageHeader 
                title="Modifica Veicolo"
                actions={
                    <Can permission={acl.VEHICLE_DELETE}>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded"
                        >
                            Elimina Veicolo
                        </button>
                    </Can>
                }
            />

            <div className="w-full md:max-w-1/2">
                <Card>
                    <VehiclesForm vehicle={vehicle} onSubmit={handleSubmit} isSubmitting={isSubmitting}/>
                </Card>
            </div>
        </div>
    );
};

export default VehiclesEdit;
