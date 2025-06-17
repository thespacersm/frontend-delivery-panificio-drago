import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useServices} from '@/servicesContext';
import DeliveriesForm from '@/components/dashboard/form/DeliveriesForm';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import PageError from '@/components/dashboard/ui/PageError';
import Card from '@/components/dashboard/ui/Card';
import Delivery from '@/types/Delivery';

const DeliveriesCreate: React.FC = () => {
    const {deliveryService} = useServices();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (delivery: Delivery) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await deliveryService.createDelivery(delivery);
            navigate('/dashboard/deliveries', {state: {message: 'Consegna creata con successo!'}});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Si è verificato un errore durante la creazione della consegna');
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <PageHeader title="Nuova Consegna"/>

            {error && <PageError message={error}/>}

            <div className="w-full md:max-w-1/2">
                <Card>
                    <DeliveriesForm onSubmit={handleSubmit} isSubmitting={isSubmitting}/>
                </Card>
            </div>
        </div>
    );
};

export default DeliveriesCreate;
