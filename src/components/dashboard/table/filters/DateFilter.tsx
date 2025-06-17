import React, {useEffect, useState} from 'react';

interface DateFilterProps {
    filterKey: string;
    title: string;
    value: string;
    onChange: (key: string, value: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
                                                   filterKey,
                                                   title,
                                                   value,
                                                   onChange,
                                               }) => {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleApplyFilter = () => {
        onChange(filterKey, inputValue);
    };

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">{title}</label>
            <div className="flex">
                <input
                    type="date"
                    className="w-full border-gray-300 border rounded-md px-2 py-1"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleApplyFilter}
                />
            </div>
        </div>
    );
};

export default DateFilter;
