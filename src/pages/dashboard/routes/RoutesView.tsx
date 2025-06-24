import PageHeader from '@/components/dashboard/layout/PageHeader';
import Card from '@/components/dashboard/ui/Card';
import Loader from '@/components/dashboard/ui/Loader';
import PageError from '@/components/dashboard/ui/PageError';
import { useServices } from '@/servicesContext';
import Route from '@/types/Route';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DataType } from 'ka-table/enums';
import KaTable from '@/components/dashboard/table/KaTable';
import Customer from '@/types/Customer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faEye } from '@fortawesome/free-solid-svg-icons';


const RoutesView: React.FC = () => {
    const { routeService, deliveryService, customerService } = useServices();
    const [route, setRoute] = useState<Route | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [refreshIndex, _setRefreshIndex] = useState(0);


    useEffect(() => {
        
        const fetchRouteData = async () => {
            try {
                setLoading(true);
                const routeData = await routeService.getActiveRoute();
                setRoute(routeData);                
                setError(null);
            } catch (err) {
                setError('Errore nel caricamento dei dati della rotta');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRouteData();
    }, []);

    const fetchData = async (pageIndex: number, pageSize: number, orderBy: string, order: string, filters: any) => {
        try {
            const routeId = route?.id?.toString();
            if (!routeId) {
                throw new Error('ID della rotta non disponibile');
            }
            
            const response = await deliveryService.getDeliveriesByRouteId(routeId, pageIndex + 1, pageSize, orderBy, order, filters);
            
            const customerIds = response.data.map((delivery) => delivery.acf.customer_id as unknown as number);
            const customersResponse = await customerService.getCustomersByIds(customerIds, 1, 100, 'id', 'asc');
            

            // setCustomers(customersResponse.data);

            const parsedRows = response.data.map((delivery) => {
                const customer = customersResponse.data.find((c: Customer) => c.id === Number(delivery.acf.customer_id));
                return {
                    id: delivery.id,
                    customer: customer,
                    title: customer ? customer.title.rendered : delivery.title.rendered,
                    date: delivery.acf.date,
                    is_prepared: delivery.acf.is_prepared,
                    is_loaded: delivery.acf.is_loaded,
                    is_delivered: delivery.acf.is_delivered
                }
            });

            const parsedData = {
                data: parsedRows,
                totalPages: response.totalPages,
            };
            return parsedData;
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            throw error;
        }
    };


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

    const ViewAction = ({ row }: { row: any }) => (
        <Link to={`/dashboard/deliveries/${row.id}/view`} className="text-blue-600 hover:text-blue-900">
            <FontAwesomeIcon icon={faEye} className="mr-1" />
            Visualizza
        </Link>
    );

    const columns = [
        {key: 'id', title: 'ID', dataType: DataType.Number},
        {key: 'title', title: 'Cliente', render: (_value: any, row: any) => {
            
            return (
                <div>
                    <div className="text-sm font-medium text-gray-900">
                        {row.customer ? row.customer.title.rendered : row.title.rendered}
                    </div>
                    {row.customer && (
                        <div className="text-xs text-gray-500">
                            {row.customer.acf.address_street}, {row.customer.acf.address_location}
                        </div>
                    )}
                </div>
            )  
        }},
        // is_prepared
        {key: 'is_prepared', title: 'Preparata', width: 100, dataType: DataType.Boolean, render: (value: boolean) => (
            <div className="flex justify-left">
                <FontAwesomeIcon 
                    icon={value ? faCheckCircle : faTimesCircle} 
                    className={value ? 'text-green-500' : 'text-gray-400'} 
                />
            </div>
        )},
        
        // is_loaded
        {key: 'is_loaded', title: 'Caricata', width: 100, dataType: DataType.Boolean, render: (value: boolean) => (
            <div className="flex justify-left">
                <FontAwesomeIcon 
                    icon={value ? faCheckCircle : faTimesCircle} 
                    className={value ? 'text-green-500' : 'text-gray-400'} 
                />
            </div>
        )},
        // is_delivered
        {key: 'is_delivered', title: 'Consegnata', width: 100, dataType: DataType.Boolean, render: (value: boolean) => (
            <div className="flex justify-left">
                <FontAwesomeIcon 
                    icon={value ? faCheckCircle : faTimesCircle} 
                    className={value ? 'text-green-500' : 'text-gray-400'} 
                />
            </div>
        )},
    ];
    
    // Definizione dei filtri disponibili per la tabella
    const filterOptions = [
        {
            key: 'id',
            title: 'ID',
            type: 'number' as const
        },
        {
            key: 'title',
            title: 'Cliente',
            type: 'text' as const
        },
        {
            key: 'is_prepared',
            title: 'Preparata',
            type: 'select' as const,
            options: [
                { value: '1', label: 'Sì' },
                { value: '0', label: 'No' }
            ]
        },
        {
            key: 'is_loaded',
            title: 'Caricata',
            type: 'select' as const,
            options: [
                { value: '1', label: 'Sì' },
                { value: '0', label: 'No' }
            ]
        },
        {
            key: 'is_delivered',
            title: 'Consegnata',
            type: 'select' as const,
            options: [
                { value: '1', label: 'Sì' },
                { value: '0', label: 'No' }
            ]
        }
    ];

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
                    
                    <div>
                    <KaTable
                        columns={columns}
                        fetchData={fetchData}
                        rowKeyField="id"
                        filters={filterOptions}
                        refreshIndex={refreshIndex}
                        actions={[
                            ({row}) => <ViewAction row={row} />,
                        ]}
                    />

                    </div>
                </div>
            ) : (
                <PageError message="Nessuna rotta attiva trovata" type="info" />
            )}
        </div>
    );
};

export default RoutesView;
