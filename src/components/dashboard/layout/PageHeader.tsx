import React, {ReactNode} from 'react';

interface PageHeaderProps {
    title: string;
    actions?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({title, actions}) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
            {actions && <div>{actions}</div>}
        </div>
    );
};

export default PageHeader;
