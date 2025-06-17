import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import KaTable from '@/components/dashboard/table/KaTable';
import EditAction from '@/components/dashboard/table/actions/EditAction';
import DeleteAction from '@/components/dashboard/table/actions/DeleteAction';
import {useServices} from '@/servicesContext.tsx';
import {DataType} from 'ka-table/enums';
import Can from '@/components/dashboard/permission/Can';

const DeliveriesIndex: React.FC = () => {
    const {deliveryService} = useServices();
    const navigate = useNavigate();
    const [refreshIndex, setRefreshIndex] = useState(0);

    const fetchData = async (pageIndex: number, pageSize: number, orderBy: string, order: string, filters: any) => {
        try {
            const data = await deliveryService.getDeliveries(pageIndex + 1, pageSize, orderBy, order, filters);
            const parsedData = {
                data: data.data.map((delivery) => ({
                    id: delivery.id,
                    title: delivery.title.rendered,
                    sea_customer_code: delivery.acf.sea_customer_code,
                })),
                totalPages: data.totalPages,
            };
            return parsedData;
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            throw error;
        }
    };

    const columns = [
        {key: 'id', title: 'ID', dataType: DataType.Number},
        {key: 'title', title: 'Titolo', dataType: DataType.String},
        {key: 'sea_customer_code', title: 'Codice Cliente SEA', dataType: DataType.String},
    ]

    const handleEdit = (row: any) => {
        navigate(`/dashboard/deliveries/${row.id}/edit`);
    };

    const handleDelete = async (row: any) => {
        try {
            await deliveryService.deleteDelivery(row.id);
            setRefreshIndex(prev => prev + 1);
        } catch (error) {
            console.error('Errore durante l\'eliminazione della consegna:', error);
            alert('Si è verificato un errore durante l\'eliminazione');
        }
    };

    const filterOptions = [
        {
            key: 'id',
            title: 'ID',
            type: 'number' as const
        },
        {
            key: 'sea_customer_code',
            title: 'Codice Cliente SEA',
            type: 'text' as const
        }
    ];

    return (
        <div>
            <PageHeader
                title="Consegne"
                actions={
                    <Can permission="delivery:create">
                        <Link to="/dashboard/deliveries/new"
                              className="bg-primary hover:bg-primary-700 cursor-pointer text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded">
                            Aggiungi Consegna
                        </Link>
                    </Can>
                }
            />

            <KaTable
                columns={columns}
                fetchData={fetchData}
                rowKeyField="id"
                filters={filterOptions}
                refreshIndex={refreshIndex}
                actions={[
                    ({row}) => <EditAction row={row} onEdit={handleEdit}/>,
                    ({row}) => <Can permission="delivery:delete">
                        <DeleteAction
                            row={row}
                            onDelete={handleDelete}
                        />
                    </Can>,
                ]}
            />
        </div>
    );
};

export default DeliveriesIndex;
