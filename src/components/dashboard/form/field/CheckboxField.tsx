import React from 'react';

interface CheckboxFieldProps {
    id: string;
    name: string;
    label: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
    id,
    name,
    label,
    checked,
    onChange
}) => {
    return (
        <div className="mb-4 flex items-center">
            <input
                id={id}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor={id} className="ml-2 block text-sm font-medium text-gray-700">
                {label}
            </label>
        </div>
    );
};

export default CheckboxField;
