import React from 'react';

interface LoaderProps {
    size?: 'small' | 'medium' | 'large';
    message?: string;
    fullScreen?: boolean;
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({
                                           size = 'medium',
                                           message = 'Caricamento...',
                                           fullScreen = false,
                                           className = ''
                                       }) => {
    // Dimensioni basate sulla proprietà size
    const spinnerSizes = {
        small: 'h-6 w-6',
        medium: 'h-12 w-12',
        large: 'h-16 w-16'
    };

    const containerClasses = fullScreen
        ? 'fixed inset-0 bg-white bg-opacity-80 z-50'
        : `min-h-[300px] ${className}`;

    return (
        <div className={`flex justify-center items-center ${containerClasses}`}>
            <div
                className={`animate-spin rounded-full ${spinnerSizes[size]} border-t-2 border-b-2 border-blue-500`}></div>
            <span className="sr-only">{message}</span>
        </div>
    );
};

export default Loader;
