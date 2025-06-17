import React from 'react';
import PageHeader from '@/components/dashboard/layout/PageHeader';
import Card from '@/components/dashboard/ui/Card';
import ChangePasswordForm from '@/components/dashboard/form/ChangePasswordForm';

const SettingsIndex: React.FC = () => {
    return (
        <div>
            <PageHeader title="Impostazioni Account"/>
            <div className="w-full md:max-w-1/2">
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Cambia Password</h2>
                    <p className="mb-4">Utilizza il form qui sotto per aggiornare la tua password.</p>
                    <ChangePasswordForm />
                </Card>
            </div>
        </div>
    );
};

export default SettingsIndex;
