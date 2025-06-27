import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import Can from '@/components/dashboard/permission/Can';
import DeliveriesTable from '@/components/dashboard/table/DeliveriesTable';

const DeliveriesIndex: React.FC = () => {
    const [refreshIndex, setRefreshIndex] = useState(0);

    const handleRefresh = () => {
        setRefreshIndex(prev => prev + 1);
    };

    return (
        <div>
            <PageHeader
                title="Tutte le Consegne"
                actions={
                    <Can permission="delivery:create">
                        <Link to="/dashboard/deliveries/new"
                              className="bg-primary hover:bg-primary-700 cursor-pointer text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 text-sm sm:text-base rounded">
                            Aggiungi Consegna
                        </Link>
                    </Can>
                }
            />

            <DeliveriesTable
                refreshIndex={refreshIndex}
                onRefresh={handleRefresh}
                showEditActions={true}
                showDeleteActions={true}
                defaultPageSize={20}
            />
        </div>
    );
};

export default DeliveriesIndex;
