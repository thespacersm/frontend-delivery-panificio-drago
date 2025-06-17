import PageHeader from '@/components/dashboard/layout/PageHeader';
import Card from '@/components/dashboard/ui/Card';
import Loader from '@/components/dashboard/ui/Loader';
import PageError from '@/components/dashboard/ui/PageError';
import { useServices } from '@/servicesContext';
import Route from '@/types/Route';
import Delivery from '@/types/Delivery';
import Customer from '@/types/Customer';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faTruckLoading, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const RoutesView: React.FC = () => {
    const { routeService, deliveryService, customerService } = useServices();
    const [route, setRoute] = useState<Route | null>(null);
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [customers, setCustomers] = useState<{[key: string]: Customer}>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRouteData = async () => {
            try {
                setLoading(true);
                const routeData = await routeService.getActiveRoute();
                setRoute(routeData);

                // Carica le consegne associate alla zona della rotta
                if (routeData?.acf?.zone_id) {
                    const deliveriesResponse = await deliveryService.getDeliveriesByZoneId(routeData.acf.zone_id);
                    setDeliveries(deliveriesResponse.data);
                    
                    // Raccogli tutti gli ID dei clienti unici
                    const uniqueCustomerIds = [...new Set(
                        deliveriesResponse.data
                            .map(delivery => delivery.acf.customer_id)
                            .filter(id => id)
                            .map(id => parseInt(id))
                    )];
                    
                    // Carica tutti i clienti in una sola chiamata
                    if (uniqueCustomerIds.length > 0) {
                        try {
                            const customersArray = await customerService.getCustomersByIds(uniqueCustomerIds);
                            const customerMap: {[key: string]: Customer} = {};
                            customersArray.forEach(customer => {
                                customerMap[customer.id.toString()] = customer;
                            });
                            setCustomers(customerMap);
                        } catch (err) {
                            console.error('Errore nel caricamento dei clienti:', err);
                        }
                    }
                }
                
                setError(null);
            } catch (err) {
                setError('Errore nel caricamento dei dati della rotta');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRouteData();
    }, [routeService, deliveryService, customerService]);

    const handleDeactivate = async () => {
        if (!route || !route.id) return;
        
        if (window.confirm('Sei sicuro di voler disattivare questa rotta?')) {
            try {
                await routeService.deactivateRoute();
                navigate('/dashboard/routes');
            } catch (err) {
                setError('Errore durante la disattivazione della rotta');
                console.error(err);
            }
        }
    };

    return (
        <div>
            <PageHeader 
                title="Dettagli Rotta"
                actions={
                    <button
                        onClick={handleDeactivate}
                        className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded"
                        disabled={loading || !route}
                    >
                        Disattiva Rotta
                    </button>
                }
            />

            {loading ? (
                <Loader message="Caricamento dati rotta..." />
            ) : error ? (
                <PageError message={error} type="error" />
            ) : route ? (
                <div className="space-y-6">
                    <Card>
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Informazioni Rotta</h2>
                            <p><strong>Nome:</strong> {route.title.rendered}</p>
                            {/* Aggiungi altri dettagli della rotta qui */}
                        </div>
                    </Card>
                    
                    <Card>
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Consegne della Zona ({deliveries.length})</h2>
                            {deliveries.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articoli</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <FontAwesomeIcon icon={faUtensils} className="mr-1" /> Preparata
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <FontAwesomeIcon icon={faTruckLoading} className="mr-1" /> Caricata
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-1" /> Consegnata
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {deliveries.map((delivery) => {
                                                const customer = customers[delivery.acf.customer_id];
                                                const deliveryDate = new Date(delivery.acf.date);
                                                const formattedDate = `${deliveryDate.getFullYear()}/${String(deliveryDate.getMonth() + 1).padStart(2, '0')}/${String(deliveryDate.getDate()).padStart(2, '0')}`;
                                                
                                                return (
                                                    <tr key={delivery.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {customer ? customer.title.rendered : delivery.title.rendered}
                                                                </div>
                                                                {customer && (
                                                                    <div className="text-xs text-gray-500">
                                                                        {customer.acf.address_street}, {customer.acf.address_location}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formattedDate}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {delivery.acf.article_count}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <FontAwesomeIcon 
                                                                icon={delivery.acf.is_prepared ? faCheckCircle : faTimesCircle} 
                                                                className={delivery.acf.is_prepared ? 'text-green-500' : 'text-gray-400'} 
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <FontAwesomeIcon 
                                                                icon={delivery.acf.is_loaded ? faCheckCircle : faTimesCircle} 
                                                                className={delivery.acf.is_loaded ? 'text-blue-500' : 'text-gray-400'} 
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <FontAwesomeIcon 
                                                                icon={delivery.acf.is_delivered ? faCheckCircle : faTimesCircle} 
                                                                className={delivery.acf.is_delivered ? 'text-blue-500' : 'text-gray-400'} 
                                                            />
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500">Nessuna consegna trovata per questa zona.</p>
                            )}
                        </div>
                    </Card>
                </div>
            ) : (
                <PageError message="Nessuna rotta attiva trovata" type="info" />
            )}
        </div>
    );
};

export default RoutesView;
