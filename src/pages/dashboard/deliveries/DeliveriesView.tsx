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
    const [generatingPdf, setGeneratingPdf] = useState<boolean>(false);
    const [pdfError, setPdfError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            
            try {
                setLoading(true);
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
            
            // Crea una copia del delivery con il campo aggiornato
            const updatedDelivery = {
                ...delivery,
                acf: {
                    ...delivery.acf,
                    [field]: value
                }
            };
            
            // Invia l'aggiornamento al server
            await deliveryService.updateDelivery(parseInt(id), updatedDelivery);
            
            // Aggiorna lo stato locale
            setDelivery(updatedDelivery);
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

    const handleGeneratePdf = async () => {
        if (!id || !delivery) return;
        
        try {
            setGeneratingPdf(true);
            setPdfError(null);
            
            // Genera il PDF
            const pdfResponse = await deliveryService.generateDeliveryPdf(parseInt(id));
            
            if (pdfResponse.success && pdfResponse.attachment_id) {
                // Ottieni i dettagli del media
                const pdfMedia = await mediaService.getMediaItem(pdfResponse.attachment_id);
                
                // Redirect all'URL del file PDF
                if (pdfMedia && pdfMedia.source_url) {
                    window.open(pdfMedia.source_url, '_blank');
                } else {
                    setPdfError('PDF generato ma URL del file non disponibile');
                }
            } else {
                setPdfError('Errore nella generazione del PDF');
            }
        } catch (err) {
            setPdfError(`Errore nella generazione del PDF: ${err instanceof Error ? err.message : 'Errore sconosciuto'}`);
            console.error(err);
        } finally {
            setGeneratingPdf(false);
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
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-xl font-semibold mb-4">Informazioni Consegna</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="mb-2"><span className="font-medium">ID:</span> {delivery.id}</p>
                                <p className="mb-2"><span className="font-medium">Titolo:</span> {delivery.title.rendered}</p>
                                <p className="mb-2"><span className="font-medium">Codice Cliente SEA:</span> {delivery.acf.sea_id || 'N/A'}</p>
                                <p className="mb-2"><span className="font-medium">Data:</span> {delivery.acf.date || 'N/A'}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-medium mb-3">Stato della consegna:</h3>
                                <div className="bg-gray-50 p-3 rounded-lg shadow-sm">
                                    <StatusToggle 
                                        field="is_prepared" 
                                        isActive={delivery.acf.is_prepared} 
                                        label="Preparata" 
                                        updatingField={updatingField}
                                        onUpdate={updateDeliveryStatus}
                                    />
                                    <StatusToggle 
                                        field="is_loaded" 
                                        isActive={delivery.acf.is_loaded} 
                                        label="Caricata" 
                                        updatingField={updatingField}
                                        onUpdate={updateDeliveryStatus}
                                    />
                                    <StatusToggle 
                                        field="is_delivered" 
                                        isActive={delivery.acf.is_delivered} 
                                        label="Consegnata" 
                                        updatingField={updatingField}
                                        onUpdate={updateDeliveryStatus}
                                    />
                                    
                                    <div className="mt-4 border-t pt-4">
                                        <button
                                            onClick={handleGeneratePdf}
                                            disabled={generatingPdf}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
                                        >
                                            {generatingPdf ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Generazione in corso...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                                    </svg>
                                                    Genera PDF DDT
                                                </>
                                            )}
                                        </button>
                                        {pdfError && (
                                            <p className="mt-2 text-red-600 text-sm">{pdfError}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

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
            ) : (
                <PageError message="Nessuna consegna trovata" type="info" />
            )}
        </div>
    );
};

export default DeliveriesView;
