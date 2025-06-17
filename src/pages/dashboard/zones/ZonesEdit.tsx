import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useServices} from '@/servicesContext';
import Zone from '@/types/Zone';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import PageError from '@/components/dashboard/ui/PageError';
import Card from '@/components/dashboard/ui/Card';
import Loader from '@/components/dashboard/ui/Loader';
import Can from '@/components/dashboard/permission/Can';
import { acl } from '@/acl';

const ZonesEdit: React.FC = () => {
    const {zoneService} = useServices();
    const navigate = useNavigate();
    const {id} = useParams<{id: string}>();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [zone, setZone] = useState<Zone | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        sea_id: '',
        warehouse_id: ''
    });

    useEffect(() => {
        const fetchZone = async () => {
            if (!id) return;

            try {
                setLoadingData(true);
                const zoneData = await zoneService.getZone(parseInt(id));
                setZone(zoneData);
                setFormData({
                    title: zoneData.title.rendered,
                    sea_id: zoneData.acf.sea_id,
                    warehouse_id: zoneData.acf.warehouse_id
                });
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : `Si è verificato un errore durante il recupero della zona con ID ${id}`);
            } finally {
                setLoadingData(false);
            }
        };

        fetchZone();
    }, [id, zoneService]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!zone || !id) return;

        setLoading(true);
        setError(null);

        try {
            const zoneData: Zone = {
                ...zone,
                title: {
                    raw: formData.title,
                    rendered: formData.title
                },
                acf: {
                    sea_id: formData.sea_id,
                    warehouse_id: formData.warehouse_id
                }
            };

            await zoneService.updateZone(parseInt(id), zoneData);
            navigate('/dashboard/zones', {state: {message: 'Zona aggiornata con successo!'}});
        } catch (err) {
            setError(err instanceof Error ? err.message : `Si è verificato un errore durante l'aggiornamento della zona con ID ${id}`);
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleDelete = async () => {
        if (!id || !zone) return;
        
        if (window.confirm(`Sei sicuro di voler eliminare la zona ${zone.title.rendered}?`)) {
            try {
                setLoadingData(true);
                await zoneService.deleteZone(Number(id));
                navigate('/dashboard/zones', {
                    state: { message: 'Zona eliminata con successo!' }
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 
                    `Si è verificato un errore durante l'eliminazione della zona con ID ${id}`);
                setLoadingData(false);
            }
        }
    };

    if (loadingData) {
        return <Loader/>;
    }

    if (error) {
        return <PageError message={error}/>;
    }

    if (!zone) {
        return <PageError message="Zona non trovata" type="warning"/>;
    }

    return (
        <div>
            <PageHeader 
                title="Modifica Zona"
                actions={
                    <Can permission={acl.ZONE_DELETE}>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded"
                        >
                            Elimina Zona
                        </button>
                    </Can>
                }
            />

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
                                {loading ? 'Aggiornamento...' : 'Aggiorna Zona'}
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

export default ZonesEdit;
