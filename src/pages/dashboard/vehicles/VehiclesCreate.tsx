import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useServices} from '@/servicesContext';
import VehiclesForm from '@/components/dashboard/form/VehiclesForm';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import PageError from '@/components/dashboard/ui/PageError';
import Card from '@/components/dashboard/ui/Card';
import Vehicle from '@/types/Vehicle';

const VehiclesCreate: React.FC = () => {
    const {vehicleService} = useServices();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (vehicle: Vehicle) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await vehicleService.createVehicle(vehicle);
            // Redirect alla lista dei veicoli dopo la creazione
            navigate('/dashboard/vehicles', {state: {message: 'Veicolo creato con successo!'}});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Si è verificato un errore durante la creazione del veicolo');
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <PageHeader title="Nuovo Veicolo"/>

            {error && <PageError message={error}/>}

            <div className="w-full md:max-w-1/2">
                <Card>
                    <VehiclesForm onSubmit={handleSubmit} isSubmitting={isSubmitting}/>
                </Card>
            </div>
        </div>
    );
};

export default VehiclesCreate;
