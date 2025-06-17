import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useServices} from '@/servicesContext';
import CustomersForm from '@/components/dashboard/form/CustomersForm';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import PageError from '@/components/dashboard/ui/PageError';
import Card from '@/components/dashboard/ui/Card';
import Customer from '@/types/Customer';

const CustomersCreate: React.FC = () => {
    const {customerService} = useServices();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (customer: Customer) => {
        setIsSubmitting(true);
        setError(null);

        try {
            await customerService.createCustomer(customer);
            // Redirect alla lista dei clienti dopo la creazione
            navigate('/dashboard/customers', {state: {message: 'Cliente creato con successo!'}});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Si è verificato un errore durante la creazione del cliente');
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <PageHeader title="Nuovo Cliente"/>

            {error && <PageError message={error}/>}

            <div className="max-w-1/2">
                <Card>
                    <CustomersForm onSubmit={handleSubmit} isSubmitting={isSubmitting}/>
                </Card>
            </div>
        </div>
    );
};

export default CustomersCreate;