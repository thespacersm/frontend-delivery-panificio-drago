import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useServices} from '@/servicesContext';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import PageError from '@/components/dashboard/ui/PageError';
import Card from '@/components/dashboard/ui/Card';
import Zone from '@/types/Zone';

const ZonesCreate: React.FC = () => {
    const {zoneService} = useServices();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        sea_id: '',
        warehouse_id: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const zoneData: Partial<Zone> = {
                title: {
                    rendered: formData.title,
                    raw: formData.title
                },
                acf: {
                    sea_id: formData.sea_id,
                    warehouse_id: formData.warehouse_id
                }
            };

            await zoneService.createZone(zoneData as Zone);
            navigate('/dashboard/zones', {state: {message: 'Zona creata con successo!'}});
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Si è verificato un errore durante la creazione della zona');
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <PageHeader title="Nuova Zona"/>

            {error && <PageError message={error}/>}

            <div className="w-full md:max-w-1/2">
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Nome Zona
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sea_id">
                                Sea ID
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="sea_id"
                                name="sea_id"
                                type="text"
                                value={formData.sea_id}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="warehouse_id">
                                Warehouse ID
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="warehouse_id"
                                name="warehouse_id"
                                type="text"
                                value={formData.warehouse_id}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Creazione...' : 'Crea Zona'}
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button"
                                onClick={() => navigate('/dashboard/zones')}
                            >
                                Annulla
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ZonesCreate;
