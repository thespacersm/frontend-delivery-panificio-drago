import React, {useEffect, useState} from 'react';

interface NumberFilterProps {
    filterKey: string;
    title: string;
    value: number | string;
    onChange: (key: string, value: number | string) => void;
}

const NumberFilter: React.FC<NumberFilterProps> = ({
                                                       filterKey,
                                                       title,
                                                       value,
                                                       onChange,
                                                   }) => {
    const [inputValue, setInputValue] = useState(value.toString());

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleApplyFilter = () => {
        // Converti in numero se è un valore numerico valido
        const numericValue = inputValue !== '' ? parseFloat(inputValue) : '';
        onChange(filterKey, numericValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleApplyFilter();
        }
    };

    return (
        <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">{title}</label>
            <div className="flex">
                <input
                    type="number"
                    className="border-primary bg-white border rounded-md px-2 py-1"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleApplyFilter}
                    onKeyDown={handleKeyDown}
                    placeholder={`${title}`}
                />
            </div>
        </div>
    );
};

export default NumberFilter;
