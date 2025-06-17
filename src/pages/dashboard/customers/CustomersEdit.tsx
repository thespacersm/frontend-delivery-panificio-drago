import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useServices} from '@/servicesContext';
import CustomersForm from '@/components/dashboard/form/CustomersForm';
import Customer from '@/types/Customer';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import PageError from '@/components/dashboard/ui/PageError';
import Card from '@/components/dashboard/ui/Card';
import Loader from '@/components/dashboard/ui/Loader';
import Can from '@/components/dashboard/permission/Can';
import { acl } from '@/acl';

const CustomersEdit: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {customerService} = useServices();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        const loadCustomer = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const data = await customerService.getCustomer(Number(id));
                setCustomer(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : `Si è verificato un errore durante il recupero del cliente con ID ${id}`);
            } finally {
                setIsLoading(false);
            }
        };

        loadCustomer();
    }, [id, customerService]);

    const handleSubmit = async (customer: Customer) => {
        if (!id) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await customerService.updateCustomer(Number(id), customer);
            // Redirect alla lista dei clienti dopo l'aggiornamento
            navigate('/dashboard/customers', {state: {message: 'Cliente aggiornato con successo!'}});
        } catch (err) {
            setError(err instanceof Error ? err.message : `Si è verificato un errore durante l'aggiornamento del cliente con ID ${id}`);
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !customer) return;
        
        if (window.confirm(`Sei sicuro di voler eliminare il cliente ${customer.title.rendered || id}?`)) {
            try {
                setIsLoading(true);
                await customerService.deleteCustomer(Number(id));
                navigate('/dashboard/customers', {
                    state: { message: 'Cliente eliminato con successo!' }
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 
                    `Si è verificato un errore durante l'eliminazione del cliente con ID ${id}`);
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

    if (!customer) {
        return <PageError message="Cliente non trovato" type="warning"/>;
    }

    return (
        <div>
            <PageHeader 
                title="Modifica Cliente"
                actions={
                    <Can permission={acl.CUSTOMER_DELETE}>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded"
                        >
                            Elimina Cliente
                        </button>
                    </Can>
                }
            />

            <Card>
                <CustomersForm customer={customer} onSubmit={handleSubmit} isSubmitting={isSubmitting}/>
            </Card>
        </div>
    );
};

export default CustomersEdit;