import React from 'react';
import { Switch } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface StatusToggleProps {
    field: string;
    isActive: boolean;
    label: string;
    updatingField: string | null;
    onUpdate: (field: string, value: boolean) => Promise<void>;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ 
    field, 
    isActive, 
    label, 
    updatingField, 
    onUpdate 
}) => (
    <div className="flex items-center justify-between my-3 px-1">
        <span className="text-sm md:text-base">{label}</span>
        <div className="flex items-center">
            {updatingField === field && (
                <div className="mr-2">
                    <FontAwesomeIcon icon={faSpinner} spin className="h-4 w-4 text-primary" />
                </div>
            )}
            <Switch
                checked={isActive}
                onChange={(value) => onUpdate(field, value)}
                className={`${
                    isActive ? 'bg-primary' : 'bg-gray-300'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                disabled={updatingField !== null}
            >
                <span
                    className={`${
                        isActive ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
            </Switch>
        </div>
    </div>
);

export default StatusToggle;
