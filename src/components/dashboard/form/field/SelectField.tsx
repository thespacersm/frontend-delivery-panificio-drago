import React from 'react';
import { Option } from '@/types/Option';

interface SelectFieldProps {
    id: string;
    name: string;
    label: string;
    value: string;
    options: Option[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
                                                     id,
                                                     name,
                                                     label,
                                                     value,
                                                     options,
                                                     onChange,
                                                     required = false
                                                 }) => {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className='w-full bg-transparent rounded-md border border-gray-400 py-[10px] px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectField;
