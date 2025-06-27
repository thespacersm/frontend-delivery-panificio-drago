import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KaTable from './KaTable';
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';
import { useServices } from '@/servicesContext';
import { DataType } from 'ka-table/enums';
import Can from '@/components/dashboard/permission/Can';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Customer from '@/types/Customer';

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
    const { deliveryService, customerService } = useServices();
    const navigate = useNavigate();
    const [internalRefreshIndex, setInternalRefreshIndex] = useState(0);

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
                    is_delivered_date: delivery.acf.is_delivered_date
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

    const ViewAction = ({ row }: { row: any }) => (
        <Link to={`/dashboard/deliveries/${row.id}/view`} className="text-blue-600 hover:text-blue-900 mr-2">
            <FontAwesomeIcon icon={faEye} className="mr-1" />
            Visualizza
        </Link>
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
        {
            key: 'is_prepared', title: 'Preparata', width: 120, dataType: DataType.Boolean, render: (value: boolean) => (
                <FontAwesomeIcon
                    icon={value ? faCheckCircle : faTimesCircle}
                    className={value ? 'text-green-500' : 'text-gray-400'}
                />
            )
        },
        {
            key: 'is_prepared_date', title: 'Data Preparazione', width: 150, render: (value: string) => (
                value ? (
                    <div className="text-sm">
                        {new Date(value).toLocaleDateString('it-IT')}
                    </div>
                ) : (
                    <span className="text-gray-400">-</span>
                )
            )
        },
        {
            key: 'is_loaded', title: 'Caricata', width: 120, dataType: DataType.Boolean, render: (value: boolean) => (
                <FontAwesomeIcon
                    icon={value ? faCheckCircle : faTimesCircle}
                    className={value ? 'text-green-500' : 'text-gray-400'}
                />
            )
        },
        {
            key: 'is_loaded_date', title: 'Data Caricamento', width: 150, render: (value: string) => (
                value ? (
                    <div className="text-sm">
                        {new Date(value).toLocaleDateString('it-IT')}
                    </div>
                ) : (
                    <span className="text-gray-400">-</span>
                )
            )
        },
        {
            key: 'is_delivered', title: 'Consegnata', width: 120, dataType: DataType.Boolean, render: (value: boolean) => (
                <FontAwesomeIcon
                    icon={value ? faCheckCircle : faTimesCircle}
                    className={value ? 'text-green-500' : 'text-gray-400'}
                />
            )
        },
        {
            key: 'is_delivered_date', title: 'Data Consegna', width: 150, render: (value: string) => (
                value ? (
                    <div className="text-sm">
                        {new Date(value).toLocaleDateString('it-IT')}
                    </div>
                ) : (
                    <span className="text-gray-400">-</span>
                )
            )
        },
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
            key: 'is_prepared',
            title: 'Preparata',
            type: 'select' as const,
            options: [
                { value: '1', label: 'Sì' },
                { value: '0', label: 'No' }
            ]
        },
        {
            key: 'is_prepared_date',
            title: 'Data Preparazione',
            type: 'daterange' as const
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
            key: 'is_loaded_date',
            title: 'Data Caricamento',
            type: 'daterange' as const
        },
        {
            key: 'is_delivered',
            title: 'Consegnata',
            type: 'select' as const,
            options: [
                { value: '1', label: 'Sì' },
                { value: '0', label: 'No' }
            ]
        },
        {
            key: 'is_delivered_date',
            title: 'Data Consegna',
            type: 'daterange' as const
        }
    ];

    const actions = [
        ({ row }: { row: any }) => <ViewAction row={row} />,
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
