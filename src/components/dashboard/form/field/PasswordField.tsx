import React, { useState } from 'react';

interface PasswordFieldProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    id,
    name,
    label,
    value,
    onChange,
    required = false,
    placeholder = '',
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='mb-4'>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    className='w-full bg-transparent rounded-md border border-gray-400 py-[10px] px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2'
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? (
                        <span>Nascondi</span>
                    ) : (
                        <span>Mostra</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PasswordField;
