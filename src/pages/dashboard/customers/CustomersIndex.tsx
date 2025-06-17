import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import KaTable from '@/components/dashboard/table/KaTable';
import EditAction from '@/components/dashboard/table/actions/EditAction';
import DeleteAction from '@/components/dashboard/table/actions/DeleteAction';
import {useServices} from '@/servicesContext.tsx';
import {DataType} from 'ka-table/enums';
import Can from '@/components/dashboard/permission/Can';
import { acl } from '@/acl';

const CustomersIndex: React.FC = () => {
    const {customerService} = useServices();
    const navigate = useNavigate();
    const [refreshIndex, setRefreshIndex] = useState(0);

    const fetchData = async (pageIndex: number, pageSize: number, orderBy: string, order: string, filters: any) => {
        try {
            const data = await customerService.getCustomers(pageIndex + 1, pageSize, orderBy, order, filters);
            const parsedData = {
                data: data.data.map((customer) => ({
                    id: customer.id,
                    title: customer.title.rendered,
                })),
                totalPages: data.totalPages,
            };
            return parsedData;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    };

    const columns = [
        {key: 'id', title: 'ID', dataType: DataType.Number},
        {key: 'title', title: 'Nome', dataType: DataType.String},
    ]

    const handleEdit = (row: any) => {
        navigate(`/dashboard/customers/${row.id}/edit`);
    };

    const handleDelete = async (row: any) => {
        try {
            await customerService.deleteCustomer(row.id);
            // Incrementa refreshIndex per forzare il refresh della tabella
            setRefreshIndex(prev => prev + 1);
        } catch (error) {
            console.error('Errore durante l\'eliminazione del cliente:', error);
            alert('Si è verificato un errore durante l\'eliminazione');
        }
    };

    // Definizione dei filtri disponibili per la tabella
    const filterOptions = [
        {
            key: 'id',
            title: 'ID',
            type: 'number' as const
        },
        {
            key: 'email',
            title: 'Email',
            type: 'text' as const
        }
    ];

    return (
        <div>
            <PageHeader
                title="Clienti"
                actions={
                    <Can permission={acl.CUSTOMER_CREATE}>
                        <Link to="/dashboard/customers/new"
                              className="bg-primary hover:bg-primary-700 cursor-pointer text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded">
                            Aggiungi Cliente
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
                    ({row}) => <Can permission={acl.CUSTOMER_DELETE}>
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

export default CustomersIndex;