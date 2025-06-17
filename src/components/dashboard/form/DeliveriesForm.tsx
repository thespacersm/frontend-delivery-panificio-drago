import React, {useState, useEffect} from 'react';
import Delivery from '@/types/Delivery';

interface DeliveriesFormProps {
    delivery?: Delivery;
    onSubmit: (delivery: Delivery) => void;
    isSubmitting?: boolean;
}

const DeliveriesForm: React.FC<DeliveriesFormProps> = ({delivery, onSubmit, isSubmitting = false}) => {
    const [formData, setFormData] = useState<Delivery>({} as Delivery);

    useEffect(() => {
        if (delivery) {
            setFormData(delivery);
        }
    }, [delivery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        
        if (name.startsWith('acf.')) {
            const fieldName = name.replace('acf.', '');
            setFormData(prev => ({
                ...prev,
                acf: {
                    ...prev.acf,
                    [fieldName]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                               type === 'number' ? Number(value) : value
                }
            }));
        } else if (name === 'title') {
            setFormData(prev => ({
                ...prev,
                title: {
                    rendered: value,
                    raw: value
                }
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Titolo *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title.rendered}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
            </div>

            <div>
                <label htmlFor="acf.sea_customer_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Codice Cliente SEA *
                </label>
                <input
                    type="text"
                    id="acf.sea_customer_code"
                    name="acf.sea_customer_code"
                    value={formData.acf.sea_customer_code}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
            </div>

            <div>
                <label htmlFor="acf.date" className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                </label>
                <input
                    type="date"
                    id="acf.date"
                    name="acf.date"
                    value={formData.acf.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="acf.is_prepared"
                            checked={formData.acf.is_prepared}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        Preparata
                    </label>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="acf.is_loaded"
                            checked={formData.acf.is_loaded}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        Caricata
                    </label>
                </div>
                <div>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="acf.is_delivered"
                            checked={formData.acf.is_delivered}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        Consegnata
                    </label>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    {isSubmitting ? 'Salvando...' : 'Salva'}
                </button>
            </div>
        </form>
    );
};

export default DeliveriesForm;
