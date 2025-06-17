import React, {useEffect, useState} from 'react';

interface SelectFilterProps {
    filterKey: string;
    title: string;
    value: string | number;
    options: { value: string | number; label: string }[];
    onChange: (key: string, value: string | number) => void;
}

const SelectFilter: React.FC<SelectFilterProps> = ({
                                                       filterKey,
                                                       title,
                                                       value,
                                                       options,
                                                       onChange,
                                                   }) => {
    const [selectedValue, setSelectedValue] = useState(value);

    useEffect(() => {
        setSelectedValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setSelectedValue(newValue);
        onChange(filterKey, newValue);
    };

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">{title}</label>
            <select
                className="border-primary bg-white border rounded-md px-2 py-1"
                value={selectedValue as string}
                onChange={handleChange}
            >
                <option value="">Tutti</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectFilter;
