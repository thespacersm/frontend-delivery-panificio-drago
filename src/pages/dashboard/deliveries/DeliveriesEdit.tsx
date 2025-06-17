import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useServices} from '@/servicesContext';
import DeliveriesForm from '@/components/dashboard/form/DeliveriesForm';
import Delivery from '@/types/Delivery';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import PageError from '@/components/dashboard/ui/PageError';
import Card from '@/components/dashboard/ui/Card';
import Loader from '@/components/dashboard/ui/Loader';
import Can from '@/components/dashboard/permission/Can';

const DeliveriesEdit: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {deliveryService} = useServices();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [delivery, setDelivery] = useState<Delivery | null>(null);

    useEffect(() => {
        const loadDelivery = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const data = await deliveryService.getDelivery(Number(id));
                setDelivery(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : `Si è verificato un errore durante il recupero della consegna con ID ${id}`);
            } finally {
                setIsLoading(false);
            }
        };

        loadDelivery();
    }, [id, deliveryService]);

    const handleSubmit = async (delivery: Delivery) => {
        if (!id) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await deliveryService.updateDelivery(Number(id), delivery);
            navigate('/dashboard/deliveries', {state: {message: 'Consegna aggiornata con successo!'}});
        } catch (err) {
            setError(err instanceof Error ? err.message : `Si è verificato un errore durante l'aggiornamento della consegna con ID ${id}`);
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !delivery) return;
        
        if (window.confirm(`Sei sicuro di voler eliminare la consegna ${delivery.title.rendered || id}?`)) {
            try {
                setIsLoading(true);
                await deliveryService.deleteDelivery(Number(id));
                navigate('/dashboard/deliveries', {
                    state: { message: 'Consegna eliminata con successo!' }
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 
                    `Si è verificato un errore durante l'eliminazione della consegna con ID ${id}`);
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

    if (!delivery) {
        return <PageError message="Consegna non trovata" type="warning"/>;
    }

    return (
        <div>
            <PageHeader 
                title="Modifica Consegna"
                actions={
                    <Can permission="delivery:delete">
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded"
                        >
                            Elimina Consegna
                        </button>
                    </Can>
                }
            />

            <div className="w-full md:max-w-1/2">
                <Card>
                    <DeliveriesForm delivery={delivery} onSubmit={handleSubmit} isSubmitting={isSubmitting}/>
                </Card>
            </div>
        </div>
    );
};

export default DeliveriesEdit;
