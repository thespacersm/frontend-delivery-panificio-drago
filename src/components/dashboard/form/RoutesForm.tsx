import React, {useMemo, useState} from 'react';
import Route from '@/types/Route';
import Zone from '@/types/Zone';
import SelectField from './field/SelectField';
import CheckboxField from './field/CheckboxField';
import SubmitButton from './field/SubmitButton';
import {updateFormData} from '@/utils/formUtils';
import Vehicle from '@/types/Vehicle';
import {Option} from '@/types/Option';

interface RoutesFormProps {
    route?: Route;
    onSubmit: (data: Route) => Promise<void>;
    isSubmitting: boolean;
    vehicles: Vehicle[];
    zones: Zone[];
}

const RoutesForm: React.FC<RoutesFormProps> = ({route, onSubmit, isSubmitting, vehicles, zones}) => {

    const [formData, setFormData] = useState<Route>({
        ...route || {},
        status: 'publish',
        title: {
            raw: route?.title?.raw || '',
        },
        acf: {
            ...route?.acf || {},
            date: new Date().toISOString(),
            active: true,
        }
    } as Route);

    // Genera le options per il select a partire dai veicoli
    const vehicleOptions: Option[] = useMemo(() => {
        const options = vehicles.map(vehicle => ({
            value: vehicle.id.toString(),
            label: vehicle.title.rendered || `Veicolo ${vehicle.id}`
        })).sort((a, b) => a.label.localeCompare(b.label));

        return [
            { value: '', label: 'Seleziona un veicolo' },
            ...options
        ];
    }, [vehicles]);

    // Genera le options per il select delle zone
    const zoneOptions: Option[] = useMemo(() => {
        const options = zones.map(zone => ({
            value: zone.id.toString(),
            label: zone.title.rendered || `Zona ${zone.id}`
        })).sort((a, b) => a.label.localeCompare(b.label));

        return [
            { value: '', label: 'Seleziona una zona' },
            ...options
        ];
    }, [zones]);

    const generateTitle = (formData: Route): string => {

        // Create the title with: date (dd/mm/yyyy) - plate
        const date = new Date(formData.acf.date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const plate = formData.acf.plate || 'Targa non disponibile';

        return `${day}/${month}/${year} - ${plate}`;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type, checked} = e.target as HTMLInputElement;
        
        // Utilizza la utility aggiornata con il parametro type
        let newFormData = updateFormData(formData, name, value, type, checked);

        if (newFormData.acf?.internal_vehicle) {
            // Se il veicolo è interno e è stato selezionato un veicolo
            if (newFormData.acf?.vehicle_id) {
                // Trova il veicolo selezionato
                const selectedVehicle = vehicles.find(vehicle => vehicle.id.toString() === newFormData.acf.vehicle_id);

                // Aggiorna la targa del veicolo
                newFormData = {
                    ...newFormData,
                    acf: {
                        ...newFormData.acf,
                        plate: selectedVehicle?.acf?.plate || ''
                    }
                };
            }
        } else {
            // Se il veicolo non è interno, svuota vehicle_id e plate
            newFormData = {
                ...newFormData,
                acf: {
                    ...newFormData.acf,
                    vehicle_id: '',
                    plate: ''
                }
            };
        }

        newFormData = {
            ...newFormData,
            title: {
                ...newFormData.title,
                raw: generateTitle(newFormData)
            }
        }

        setFormData(newFormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <CheckboxField
                id="internal_vehicle"
                name="acf.internal_vehicle"
                label="Veicolo interno"
                checked={formData?.acf?.internal_vehicle || false}
                onChange={handleChange}
            />

            {formData?.acf?.internal_vehicle && (
                <SelectField
                    id="vehicle"
                    name="acf.vehicle_id"
                    label="Veicolo"
                    value={formData?.acf?.vehicle_id || ''}
                    options={vehicleOptions}
                    onChange={handleChange}
                    required
                />
            )}

            <SelectField
                id="zone"
                name="acf.zone_id"
                label="Zona"
                value={formData?.acf?.zone_id || ''}
                options={zoneOptions}
                onChange={handleChange}
                required
            />

            <SubmitButton
                isSubmitting={isSubmitting}
                submitLabel={route ? 'Aggiorna rotta' : 'Crea rotta'}
            />
        </form>
    );
};

export default RoutesForm;
