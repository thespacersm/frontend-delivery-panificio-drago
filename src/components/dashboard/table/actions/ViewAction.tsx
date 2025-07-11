import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import ActionCell from './ActionCell';

interface ViewActionProps {
    row: any;
    onView: (row: any) => void;
}

const ViewAction: React.FC<ViewActionProps> = ({ row, onView }) => {
    return (
        <ActionCell
            icon={
                <div className="bg-blue-600 md:bg-transparent hover:bg-blue-700 md:hover:bg-transparent text-white md:text-blue-600 px-3 md:px-0 py-1 md:py-0 rounded-md md:rounded-none text-sm font-medium flex items-center gap-2">
                    <FontAwesomeIcon icon={faEye} size="sm" />
                    <span className="md:hidden">Apri</span>
                </div>
            }
            onClick={() => onView(row)}
            title="Visualizza"
            className="text-blue-600 hover:text-blue-900"
        />
    );
};

export default ViewAction;
