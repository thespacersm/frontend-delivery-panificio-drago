import React, {useState, useEffect} from 'react';
import Delivery from '@/types/Delivery';

interface DeliveriesFormProps {
    delivery?: Delivery;
    onSubmit: (delivery: Delivery) => void;
    isSubmitting?: boolean;
}

const DeliveriesForm: React.FC<DeliveriesFormProps> = ({delivery, onSubmit, isSubmitting = false}) => {
    const [formData, setFormData] = useState<Delivery>({
        title: {} as any,
        acf: {} as any,
    } as Delivery);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        if (delivery) {
            setFormData(delivery);
        }
    }, [delivery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
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
        } else if (name === 'content') {
            setFormData(prev => ({
                ...prev,
                content: {
                    rendered: value,
                    raw: value
                }
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {showSuccessMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    Consegna salvata con successo!
                </div>
            )}
            
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
                    readOnly
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-gray-50 cursor-not-allowed"
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
                    readOnly
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-gray-50 cursor-not-allowed"
                />
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Note
                </label>
                <textarea
                    id="content"
                    name="content"
                    value={formData.content?.rendered || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
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
