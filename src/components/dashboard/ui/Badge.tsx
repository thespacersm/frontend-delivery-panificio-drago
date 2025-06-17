import React, {ReactNode} from 'react';

interface BadgeProps {
    icon: ReactNode;
    title: string;
    value: ReactNode;
    subValue?: string;
    iconBgColor?: string;
    iconColor?: string;
    valueColor?: string;
}

const Badge: React.FC<BadgeProps> = ({
                                         icon,
                                         title,
                                         value,
                                         subValue,
                                         iconBgColor = 'bg-blue-100',
                                         iconColor = 'text-blue-500',
                                         valueColor = '',
                                     }) => {
    return (
        <div className="bg-white rounded-lg shadow p-4 flex items-start">
            <div className={`${iconBgColor} p-3 rounded-full mr-4 flex items-center justify-center`}>
                <div className={`${iconColor} flex items-center justify-center text-xl`}>{icon}</div>
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className={`text-xl font-bold ${valueColor}`}>{value}</p>
                {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
            </div>
        </div>
    );
};

export default Badge;
