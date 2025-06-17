import React, {useState} from 'react';
import Customer from '@/types/Customer';
import TextField from './field/TextField';
import SubmitButton from './field/SubmitButton';
import { updateFormData } from '@/utils/formUtils';

interface CustomersFormProps {
    customer?: Customer;
    onSubmit: (data: Customer) => Promise<void>;
    isSubmitting: boolean;
}

const CustomersForm: React.FC<CustomersFormProps> = ({customer, onSubmit, isSubmitting}) => {
    
    const [formData, setFormData] = useState<Customer>({
        ...customer || {},
        status: 'publish'
    } as Customer);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Utilizziamo la nuova utility solo per aggiornare i dati
        const newFormData = updateFormData(formData, name, value);
        setFormData(newFormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <TextField
                id="title"
                name="title.raw"
                label="Nome Cliente"
                value={formData?.title?.raw || formData?.title?.rendered || ''}
                onChange={handleChange}
                required
            />

            <TextField
                id="acf.email"
                name="acf.email"
                label="Email"
                value={formData?.acf?.email || ''}
                onChange={handleChange}
                type="email"
                required
            />

            <TextField
                id="acf.address"
                name="acf.address"
                label="Indirizzo"
                value={formData?.acf?.address_street || ''}
                onChange={handleChange}
                required
            />

            <TextField
                id="acf.city"
                name="acf.city"
                label="Città"
                value={formData?.acf?.address_location || ''}
                onChange={handleChange}
                required
            />

            <TextField
                id="acf.zip"
                name="acf.zip"
                label="CAP"
                value={formData?.acf?.address_zip || ''}
                onChange={handleChange}
                required
            />

            <SubmitButton
                isSubmitting={isSubmitting}
                submitLabel={customer ? 'Aggiorna cliente' : 'Crea cliente'}
            />
        </form>
    );
};

export default CustomersForm;
