import React, {useEffect, useState} from 'react';

interface TextFilterProps {
    filterKey: string;
    title: string;
    value: string;
    onChange: (key: string, value: string) => void;
}

const TextFilter: React.FC<TextFilterProps> = ({
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleApplyFilter();
        }
    };

    return (
        <div className="flex flex-col w-full">
            <label className="text-sm font-medium text-gray-700 mb-1">{title}</label>
            <div className="flex">
                <input
                    type="text"
                    className="w-full border-primary bg-white border rounded-md px-2 py-1"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleApplyFilter}
                    onKeyDown={handleKeyDown}
                    placeholder={`Filtra per ${title.toLowerCase()}`}
                />
            </div>
        </div>
    );
};

export default TextFilter;
