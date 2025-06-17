import React from 'react';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import Card from '@/components/dashboard/ui/Card';

const DashboardIndex: React.FC = () => {
    return (
        <div>
            <PageHeader title="Dashboard"/>
            <Card>
                <p>Benvenuto nella tua dashboard!</p>
            </Card>
        </div>
    );
};

export default DashboardIndex;