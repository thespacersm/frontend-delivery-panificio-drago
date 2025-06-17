import React, {ReactNode} from 'react';

interface ActionCellProps {
    icon: ReactNode;
    onClick: () => void;
    title?: string;
    className?: string;
}

const ActionCell: React.FC<ActionCellProps> = ({
                                                   icon,
                                                   onClick,
                                                   title,
                                                   className = ''
                                               }) => {
    return (
        <button
            type="button"
            className={`p-1 mx-1 rounded-full hover:bg-gray-200 transition-colors ${className}`}
            onClick={onClick}
            title={title}
        >
            {icon}
        </button>
    );
};

export default ActionCell;
