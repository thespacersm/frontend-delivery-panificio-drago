import React from 'react';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import Card from '@/components/dashboard/ui/Card';
import Can from '@/components/dashboard/permission/Can';
import CarrierRoute from '@/components/dashboard/index/CarrierRoute';
import {acl} from '@/acl';

const DashboardIndex: React.FC = () => {
    return (
        <div>
            <PageHeader title="Dashboard"/>
            <div className="space-y-6">
                <Card>
                    <p>Benvenuto nella tua dashboard!</p>
                </Card>
                
                <Can permission={acl.ROUTE_CREATE}>
                    <CarrierRoute />
                </Can>
            </div>
        </div>
    );
};

export default DashboardIndex;