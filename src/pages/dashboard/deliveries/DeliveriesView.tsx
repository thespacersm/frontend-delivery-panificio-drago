import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import Card from '@/components/dashboard/ui/Card';
import Loader from '@/components/dashboard/ui/Loader';
import PageError from '@/components/dashboard/ui/PageError';
import StatusToggle from '@/components/dashboard/deliveries/StatusToggle';
import { useServices } from '@/servicesContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const DeliveriesView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { deliveryService, customerService } = useServices();
    const [delivery, setDelivery] = useState<any>(null);
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingField, setUpdatingField] = useState<string | null>(null);

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
                </div>
            ) : (
                <PageError message="Nessuna consegna trovata" type="info" />
            )}
        </div>
    );
};

export default DeliveriesView;
