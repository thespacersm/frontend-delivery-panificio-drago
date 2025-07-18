import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KaTable from './KaTable';
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';
import ViewAction from './actions/ViewAction';
import { useServices } from '@/servicesContext';
import { DataType } from 'ka-table/enums';
import Can from '@/components/dashboard/permission/Can';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Customer from '@/types/Customer';
import { acl } from '@/acl';

interface DeliveriesTableProps {
    routeId?: string | null;
    refreshIndex?: number;
    onRefresh?: () => void;
    showEditActions?: boolean;
    showDeleteActions?: boolean;
    defaultPageSize?: number;
    pageSizes?: number[];
}

const DeliveriesTable: React.FC<DeliveriesTableProps> = ({
    routeId = null,
    refreshIndex = 0,
    onRefresh,
    showEditActions = true,
    showDeleteActions = true,
    defaultPageSize = 20,
    pageSizes = [5, 10, 20, 50, 100]
}) => {
    const { deliveryService, customerService, userService } = useServices();
    const navigate = useNavigate();
    const [internalRefreshIndex, setInternalRefreshIndex] = useState(0);
    const [hasAdvancedView, setHasAdvancedView] = useState(false);

    useEffect(() => {
        const checkPermission = async () => {
            try {
                const hasPermission = await userService.hasPermission(acl.DELIVERY_ADVANCED_VIEW);
                setHasAdvancedView(hasPermission);
            } catch (error) {
                console.error('Errore durante la verifica del permesso:', error);
                setHasAdvancedView(false);
            }
        };

        checkPermission();
    }, [userService]);

    const fetchData = async (pageIndex: number, pageSize: number, orderBy: string, order: string, filters: any) => {
        try {
            let response;
            if (routeId) {
                response = await deliveryService.getDeliveriesByRouteId(routeId, pageIndex + 1, pageSize, orderBy, order, filters);
            } else {
                response = await deliveryService.getDeliveries(pageIndex + 1, pageSize, orderBy, order, filters);
            }
            
            const customerIds = response.data.map((delivery) => delivery.acf.customer_id as unknown as number);
            const customersResponse = await customerService.getCustomersByIds(customerIds, 1, 100, 'id', 'asc');

            const parsedRows = response.data.map((delivery) => {
                const customer = customersResponse.data.find((c: Customer) => c.id === Number(delivery.acf.customer_id));
                return {
                    id: delivery.id,
                    customer: customer,
                    title: customer ? customer.title.rendered : delivery.title.rendered,
                    date: delivery.acf.date,
                    is_prepared: delivery.acf.is_prepared,
                    is_loaded: delivery.acf.is_loaded,
                    is_delivered: delivery.acf.is_delivered,
                    is_prepared_date: delivery.acf.is_prepared_date,
                    is_loaded_date: delivery.acf.is_loaded_date,
                    is_delivered_date: delivery.acf.is_delivered_date,
                    zone_name: delivery.acf.zone_name,
                    carrier_name: delivery.acf.carrier_name,
                    vehicle_name: delivery.acf.vehicle_name
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

    const handleEdit = (row: any) => {
        navigate(`/dashboard/deliveries/${row.id}/edit`);
    };

    const handleView = (row: any) => {
        navigate(`/dashboard/deliveries/${row.id}/view`);
    };

    const handleDelete = async (row: any) => {
        try {
            await deliveryService.deleteDelivery(row.id);
            setInternalRefreshIndex(prev => prev + 1);
            onRefresh && onRefresh();
        } catch (error) {
            console.error('Errore durante l\'eliminazione della consegna:', error);
            alert('Si è verificato un errore durante l\'eliminazione');
        }
    };

    const handleTogglePrepared = async (row: any) => {
        const newState = !row.is_prepared;
        const message = newState 
            ? 'Sei sicuro di voler segnare questa consegna come preparata?'
            : 'Sei sicuro di voler segnare questa consegna come non preparata?';
        
        if (window.confirm(message)) {
            try {
                await deliveryService.togglePrepared(row.id, newState);
                setInternalRefreshIndex(prev => prev + 1);
                onRefresh && onRefresh();
            } catch (error) {
                console.error('Errore durante l\'aggiornamento dello stato di preparazione:', error);
                alert('Si è verificato un errore durante l\'aggiornamento');
            }
        }
    };

    const handleToggleLoaded = async (row: any) => {
        const newState = !row.is_loaded;
        const message = newState 
            ? 'Sei sicuro di voler segnare questa consegna come caricata?'
            : 'Sei sicuro di voler segnare questa consegna come non caricata?';
        
        if (window.confirm(message)) {
            try {
                await deliveryService.toggleLoaded(row.id, newState);
                setInternalRefreshIndex(prev => prev + 1);
                onRefresh && onRefresh();
            } catch (error) {
                console.error('Errore durante l\'aggiornamento dello stato di caricamento:', error);
                alert('Si è verificato un errore durante l\'aggiornamento');
            }
        }
    };

    const handleToggleDelivered = async (row: any) => {
        const newState = !row.is_delivered;
        const message = newState 
            ? 'Sei sicuro di voler segnare questa consegna come consegnata?'
            : 'Sei sicuro di voler segnare questa consegna come non consegnata?';
        
        if (window.confirm(message)) {
            try {
                await deliveryService.toggleDelivered(row.id, newState);
                setInternalRefreshIndex(prev => prev + 1);
                onRefresh && onRefresh();
            } catch (error) {
                console.error('Errore durante l\'aggiornamento dello stato di consegna:', error);
                alert('Si è verificato un errore durante l\'aggiornamento');
            }
        }
    };

    const ToggleButton = ({ value, onClick, title }: { value: boolean; onClick: () => void; title: string }) => (
        <button
            onClick={onClick}
            className="cursor-pointer hover:scale-110 transition-transform"
            title={title}
        >
            <FontAwesomeIcon
                icon={value ? faCheckCircle : faTimesCircle}
                className={value ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'}
            />
        </button>
    );

    const columns = [
        { key: 'id', title: 'ID', dataType: DataType.Number },
        {
            key: 'title', title: 'Cliente', render: (_value: any, row: any) => {
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
            }
        },
        { key: 'zone_name', title: 'Zona', dataType: DataType.String },
        ...(hasAdvancedView ? [
            { key: 'carrier_name', title: 'Trasportatore', dataType: DataType.String },
            { key: 'vehicle_name', title: 'Veicolo', dataType: DataType.String },
        ] : []),
        {
            key: 'is_prepared', title: 'Preparata', width: 120, dataType: DataType.Boolean, render: (value: boolean, row: any) => (
                <ToggleButton 
                    value={value} 
                    onClick={() => handleTogglePrepared(row)}
                    title={value ? 'Clicca per segnare come non preparata' : 'Clicca per segnare come preparata'}
                />
            )
        },
        ...(hasAdvancedView ? [{
            key: 'is_prepared_date', title: 'Data Preparazione', width: 150, render: (value: string) => (
                value ? (
                    <div className="text-sm">
                        {new Date(value).toLocaleString('it-IT', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                ) : (
                    <span className="text-gray-400">-</span>
                )
            )
        }] : []),
        {
            key: 'is_loaded', title: 'Caricata', width: 120, dataType: DataType.Boolean, render: (value: boolean, row: any) => (
                <ToggleButton 
                    value={value} 
                    onClick={() => handleToggleLoaded(row)}
                    title={value ? 'Clicca per segnare come non caricata' : 'Clicca per segnare come caricata'}
                />
            )
        },
        ...(hasAdvancedView ? [{
            key: 'is_loaded_date', title: 'Data Caricamento', width: 150, render: (value: string) => (
                value ? (
                    <div className="text-sm">
                        {new Date(value).toLocaleString('it-IT', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                ) : (
                    <span className="text-gray-400">-</span>
                )
            )
        }] : []),
        {
            key: 'is_delivered', title: 'Consegnata', width: 120, dataType: DataType.Boolean, render: (value: boolean, row: any) => (
                <ToggleButton 
                    value={value} 
                    onClick={() => handleToggleDelivered(row)}
                    title={value ? 'Clicca per segnare come non consegnata' : 'Clicca per segnare come consegnata'}
                />
            )
        },
        ...(hasAdvancedView ? [{
            key: 'is_delivered_date', title: 'Data Consegna', width: 150, render: (value: string) => (
                value ? (
                    <div className="text-sm">
                        {new Date(value).toLocaleString('it-IT', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                ) : (
                    <span className="text-gray-400">-</span>
                )
            )
        }] : []),
    ];

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
            key: 'zone_name',
            title: 'Zona',
            type: 'text' as const
        },
        ...(hasAdvancedView ? [
            {
                key: 'carrier_name',
                title: 'Trasportatore',
                type: 'text' as const
            },
            {
                key: 'vehicle_name',
                title: 'Veicolo',
                type: 'text' as const
            },
        ] : []),
        {
            key: 'is_prepared',
            title: 'Preparata',
            type: 'select' as const,
            options: [
                { value: '1', label: 'Sì' },
                { value: '0', label: 'No' }
            ]
        },
        ...(hasAdvancedView ? [{
            key: 'is_prepared_date',
            title: 'Data Preparazione',
            type: 'daterange' as const
        }] : []),
        {
            key: 'is_loaded',
            title: 'Caricata',
            type: 'select' as const,
            options: [
                { value: '1', label: 'Sì' },
                { value: '0', label: 'No' }
            ]
        },
        ...(hasAdvancedView ? [{
            key: 'is_loaded_date',
            title: 'Data Caricamento',
            type: 'daterange' as const
        }] : []),
        {
            key: 'is_delivered',
            title: 'Consegnata',
            type: 'select' as const,
            options: [
                { value: '1', label: 'Sì' },
                { value: '0', label: 'No' }
            ]
        },
        ...(hasAdvancedView ? [{
            key: 'is_delivered_date',
            title: 'Data Consegna',
            type: 'daterange' as const
        }] : [])
    ];

    const actions = [
        ({ row }: { row: any }) => <ViewAction row={row} onView={handleView} />,
        ...(showEditActions ? [({ row }: { row: any }) => <EditAction row={row} onEdit={handleEdit} />] : []),
        ...(showDeleteActions ? [({ row }: { row: any }) => (
            <Can permission="delivery:delete">
                <DeleteAction row={row} onDelete={handleDelete} />
            </Can>
        )] : []),
    ];

    return (
        <KaTable
            columns={columns}
            fetchData={fetchData}
            rowKeyField="id"
            filters={filterOptions}
            refreshIndex={refreshIndex + internalRefreshIndex}
            pageSizes={pageSizes}
            defaultPageSize={defaultPageSize}
            actions={actions}
        />
    );
};

export default DeliveriesTable;
