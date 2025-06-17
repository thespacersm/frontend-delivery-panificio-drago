import React, {useState} from 'react';
import Vehicle from '@/types/Vehicle';
import TextField from './field/TextField';
import SubmitButton from './field/SubmitButton';
import { updateFormData } from '@/utils/formUtils';

interface VehiclesFormProps {
    vehicle?: Vehicle;
    onSubmit: (data: Vehicle) => Promise<void>;
    isSubmitting: boolean;
}

const VehiclesForm: React.FC<VehiclesFormProps> = ({vehicle, onSubmit, isSubmitting}) => {
    
    const [formData, setFormData] = useState<Vehicle>({
        ...vehicle || {},
        status: 'publish'
    } as Vehicle);

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
                label="Titolo"
                value={formData?.title?.raw || formData?.title?.rendered || ''}
                onChange={handleChange}
                required
            />

            <TextField
                id="acf.plate"
                name="acf.plate"
                label="Targa"
                value={formData?.acf?.plate || ''}
                onChange={handleChange}
                required
            />
            
            <TextField
                id="acf.imei"
                name="acf.imei"
                label="Imei"
                value={formData?.acf?.imei || ''}
                onChange={handleChange}
            />

            <SubmitButton
                isSubmitting={isSubmitting}
                submitLabel={vehicle ? 'Aggiorna veicolo' : 'Crea veicolo'}
            />
        </form>
    );
};

export default VehiclesForm;
