import React from 'react';

interface TextFieldProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number';
}

const TextField: React.FC<TextFieldProps> = ({
                                                 id,
                                                 name,
                                                 label,
                                                 value,
                                                 onChange,
                                                 required = false,
                                                 placeholder = '',
                                                 type = 'text'
                                             }) => {
    return (
        <div className='mb-4'>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className='w-full bg-transparent rounded-md border border-gray-400 py-[10px] px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                />
        </div>
    );
};

export default TextField;
