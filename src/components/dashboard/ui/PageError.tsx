import React from 'react';

interface PageErrorProps {
    message: string;
    type?: 'error' | 'warning' | 'info';
}

const PageError: React.FC<PageErrorProps> = ({message, type = 'error'}) => {
    const getStylesByType = () => {
        switch (type) {
            case 'warning':
                return 'bg-yellow-100 border-yellow-400 text-yellow-700';
            case 'info':
                return 'bg-blue-100 border-blue-400 text-blue-700';
            case 'error':
            default:
                return 'bg-red-100 border-red-400 text-red-700';
        }
    };

    return (
        <div className={`${getStylesByType()} px-4 py-3 rounded mb-4`} role="alert">
            {message}
        </div>
    );
};

export default PageError;
