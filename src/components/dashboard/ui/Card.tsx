import React, {ReactNode} from 'react';

interface CardProps {
    title?: string;
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({title, children, className = ''}) => {
    return (
        <div className={`bg-boxwhite-100 shadow-md rounded p-6 md:p-8 mb-4 ${className}`}>
            {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
            {children}
        </div>
    );
};

export default Card;
