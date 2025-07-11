import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import Card from '@/components/dashboard/ui/Card';
import Loader from '@/components/dashboard/ui/Loader';
import PageError from '@/components/dashboard/ui/PageError';
import StatusToggle from '@/components/dashboard/deliveries/StatusToggle';
import { useServices } from '@/servicesContext';
import MediaGallery from '@/components/dashboard/media/MediaGallery';
import Media from '@/types/Media';
import Can from '@/components/dashboard/permission/Can';
import { acl } from '@/acl';

const DeliveriesView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { deliveryService, customerService, mediaService } = useServices();
    const [delivery, setDelivery] = useState<any>(null);
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingField, setUpdatingField] = useState<string | null>(null);
    const [media, setMedia] = useState<Media[]>([]);
    const [loadingMedia, setLoadingMedia] = useState<boolean>(false);
    const [mediaError, setMediaError] = useState<string | null>(null);
    const [updatingGallery, setUpdatingGallery] = useState<boolean>(false);
    const [note, setNote] = useState<string>('');
    const [addingNote, setAddingNote] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
                
                // Carica i dati della consegna
                const deliveryData = await deliveryService.getDelivery(parseInt(id));
                setDelivery(deliveryData);
                
                // Se la consegna ha un customer_id, carica anche i dati del cliente
                if (deliveryData.acf.customer_id) {
                    const customerData = await customerService.getCustomer(deliveryData.acf.customer_id as unknown as number);
                    setCustomer(customerData);
                }
                
                setError(null);
            } catch (err) {
                setError('Errore nel caricamento dei dati della consegna');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchMedia = async () => {
            if (!delivery || !delivery.acf.gallery || delivery.acf.gallery.length === 0) {
                setMedia([]);
                return;
            }
            
            try {
                setLoadingMedia(true);
                setMediaError(null);
                
                const mediaPromises = delivery.acf.gallery.map((mediaId: number) => 
                    mediaService.getMediaItem(mediaId)
                );
                
                const mediaResults = await Promise.all(mediaPromises);
                setMedia(mediaResults);
            } catch (err) {
                setMediaError('Errore nel caricamento delle immagini');
                console.error(err);
            } finally {
                setLoadingMedia(false);
            }
        };

        fetchMedia();
    }, [delivery]);

    const updateDeliveryStatus = async (field: string, value: boolean) => {
        if (!id || !delivery) return;
        
        try {
            setUpdatingField(field);
            
            // Usa il metodo specifico per ogni flag
            switch (field) {
                case 'is_prepared':
                    await deliveryService.togglePrepared(parseInt(id), value);
                    break;
                case 'is_loaded':
                    await deliveryService.toggleLoaded(parseInt(id), value);
                    break;
                case 'is_delivered':
                    await deliveryService.toggleDelivered(parseInt(id), value);
                    break;
                default:
                    throw new Error(`Campo non supportato: ${field}`);
            }
            
            // Ricarica i dati della consegna per ottenere le date aggiornate
            const updatedDeliveryData = await deliveryService.getDelivery(parseInt(id));
            setDelivery(updatedDeliveryData);
            
        } catch (err) {
            setError(`Errore nell'aggiornamento dello stato: ${err instanceof Error ? err.message : 'Errore sconosciuto'}`);
            console.error(err);
        } finally {
            setUpdatingField(null);
        }
    };

    const handleMediaUpload = async (mediaId: number) => {
        if (!id || !delivery) return;
        
        try {
            setUpdatingGallery(true);
            
            // Crea un nuovo array di media IDs aggiungendo quello nuovo
            const currentGallery = delivery.acf.gallery || [];
            const updatedGallery = [...currentGallery, mediaId];
            
            // Crea una copia del delivery con la galleria aggiornata
            const updatedDelivery = {
                ...delivery,
                acf: {
                    ...delivery.acf,
                    gallery: updatedGallery
                }
            };
            
            // Invia l'aggiornamento al server
            await deliveryService.updateDelivery(parseInt(id), updatedDelivery);
            
            // Aggiorna lo stato locale
            setDelivery(updatedDelivery);
            
            // Carica il nuovo media
            const newMedia = await mediaService.getMediaItem(mediaId);
            setMedia(prevMedia => [...prevMedia, newMedia]);
            
        } catch (err) {
            setError(`Errore nell'aggiornamento della galleria: ${err instanceof Error ? err.message : 'Errore sconosciuto'}`);
            console.error(err);
        } finally {
            setUpdatingGallery(false);
        }
    };

    const handleAddNote = async () => {
        if (!id || !note.trim()) return;
        
        try {
            setAddingNote(true);
            await deliveryService.addNote(parseInt(id), note.trim());
            setNote('');
            // Potresti voler ricaricare i dati della consegna qui se le note sono incluse nella risposta
        } catch (err) {
            setError(`Errore nell'aggiunta della nota: ${err instanceof Error ? err.message : 'Errore sconosciuto'}`);
            console.error(err);
        } finally {
            setAddingNote(false);
        }
    };

    return (
        <div>
            <PageHeader 
                title="Dettagli Consegna"
                actions={
                    <Link 
                        to={`/dashboard/deliveries/${id}/edit`} 
                        className="bg-primary hover:bg-primary-700 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded"
                    >
                        Modifica
                    </Link>
                }
            />

            {loading ? (
                <Loader message="Caricamento dati consegna..." />
            ) : error ? (
                <PageError message={error} type="error" />
            ) : delivery ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Informazioni Consegna</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="mb-2"><span className="font-medium">Titolo:</span> {delivery.title.rendered}</p>
                                <Can permission={acl.DELIVERY_ADVANCED_VIEW}>
                                    <p className="mb-2"><span className="font-medium">Codice Cliente SEA:</span> {delivery.acf.sea_id || 'N/A'}</p>
                                </Can>
                                <p className="mb-2">
                                    <span className="font-medium">Data:</span> {
                                        delivery.acf.date ? new Date(delivery.acf.date).toLocaleDateString('it-IT') : 'N/A'
                                    }
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-medium mb-3">Stato della consegna:</h3>
                                <div className="bg-gray-50 p-3 rounded-lg shadow-sm space-y-3">
                                    <div>
                                        <StatusToggle 
                                            field="is_prepared" 
                                            isActive={delivery.acf.is_prepared} 
                                            label="Preparata" 
                                            updatingField={updatingField}
                                            onUpdate={updateDeliveryStatus}
                                            readOnly={true}
                                        />
                                        {delivery.acf.is_prepared_date && (
                                            <p className="text-xs text-gray-500 mt-1 ml-6">
                                                Data: {new Date(delivery.acf.is_prepared_date).toLocaleString('it-IT')}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <StatusToggle 
                                            field="is_loaded" 
                                            isActive={delivery.acf.is_loaded} 
                                            label="Caricata" 
                                            updatingField={updatingField}
                                            onUpdate={updateDeliveryStatus}
                                        />
                                        {delivery.acf.is_loaded_date && (
                                            <p className="text-xs text-gray-500 mt-1 ml-6">
                                                Data: {new Date(delivery.acf.is_loaded_date).toLocaleString('it-IT')}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <StatusToggle 
                                            field="is_delivered" 
                                            isActive={delivery.acf.is_delivered} 
                                            label="Consegnata" 
                                            updatingField={updatingField}
                                            onUpdate={updateDeliveryStatus}
                                        />
                                        {delivery.acf.is_delivered_date && (
                                            <p className="text-xs text-gray-500 mt-1 ml-6">
                                                Data: {new Date(delivery.acf.is_delivered_date).toLocaleString('it-IT')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Can permission={acl.DELIVERY_ADVANCED_VIEW}>
                        {customer && (
                            <Card>
                                <h2 className="text-xl font-semibold mb-4">Informazioni Cliente</h2>
                                <p className="mb-2"><span className="font-medium">Nome:</span> {customer.title.rendered}</p>
                                <p className="mb-2"><span className="font-medium">Codice Cliente SEA:</span> {customer.acf.sea_code || 'N/A'}</p>
                                <p className="mb-2">
                                    <span className="font-medium">Indirizzo:</span> {customer.acf.address_street}, {customer.acf.address_location}
                                </p>
                                {customer.acf.telephone && (
                                    <p className="mb-2"><span className="font-medium">Telefono:</span> {customer.acf.telephone}</p>
                                )}
                            </Card>
                        )}
                    </Can>

                    <div className="lg:col-span-2">
                        <Card>
                            <h2 className="text-xl font-semibold mb-4">Media</h2>
                            {updatingGallery ? (
                                <div className="text-center py-4">
                                    <Loader message="Aggiornamento galleria..." />
                                </div>
                            ) : (
                                <MediaGallery 
                                    media={media} 
                                    loading={loadingMedia} 
                                    error={mediaError}
                                    onUpload={handleMediaUpload}
                                    allowUpload={true}
                                />
                            )}
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card>
                            <h2 className="text-xl font-semibold mb-4">Note</h2>
                            <div className="space-y-4">
                                <div>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Inserisci una nota per questa consegna..."
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        rows={4}
                                        disabled={addingNote}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleAddNote}
                                        disabled={addingNote || !note.trim()}
                                        className="bg-primary hover:bg-primary-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addingNote ? 'Aggiungendo...' : 'Aggiungi nota'}
                                    </button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <PageError message="Nessuna consegna trovata" type="info" />
            )}
        </div>
    );
};

export default DeliveriesView;
