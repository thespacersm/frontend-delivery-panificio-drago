import React, { useEffect, useState } from 'react';

interface DateRangeFilterProps {
    filterKey: string;
    title: string;
    value: { from?: string; to?: string };
    onChange: (filterKey: string, value: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
    filterKey,
    title,
    value,
    onChange,
}) => {
    const [fromDate, setFromDate] = useState(value.from || '');
    const [toDate, setToDate] = useState(value.to || '');

    useEffect(() => {
        // Estrai solo la parte della data (YYYY-MM-DD) se presente
        const fromDateOnly = value.from ? value.from.split(' ')[0] : '';
        const toDateOnly = value.to ? value.to.split(' ')[0] : '';
        console.log(value);
        setFromDate(fromDateOnly);
        setToDate(toDateOnly);
    }, [value]);

    const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFromDate = e.target.value;
        setFromDate(newFromDate);

        const fromDateTime = newFromDate ? `${newFromDate} 00:00:00` : '';
        const toDateTime = toDate ? `${toDate} 23:59:59` : '';
        const dateRangeString = [fromDateTime, toDateTime].filter(Boolean).join(',');

        onChange(filterKey, dateRangeString);
    };

    const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newToDate = e.target.value;
        setToDate(newToDate);

        const fromDateTime = fromDate ? `${fromDate} 00:00` : '';
        const toDateTime = newToDate ? `${newToDate} 23:59` : '';
        const dateRangeString = [fromDateTime, toDateTime].filter(Boolean).join(',');

        onChange(filterKey, dateRangeString);
    };

    return (
        <div className="flex flex-col w-full">
            <label className="text-sm font-medium text-gray-700 mb-1">{title}</label>
            <div className="flex flex-row gap-1 sm:gap-2">
                <div className="flex flex-col w-1/2">
                    <label className="text-xs text-gray-500 mb-1">Da</label>
                    <input
                        type="date"
                        className="border-gray-300 border rounded-md px-2 py-1 text-sm w-full"
                        value={fromDate}
                        onChange={handleFromDateChange}
                    />
                </div>
                <div className="flex flex-col w-1/2">
                    <label className="text-xs text-gray-500 mb-1">A</label>
                    <input
                        type="date"
                        className="border-gray-300 border rounded-md px-2 py-1 text-sm w-full"
                        value={toDate}
                        onChange={handleToDateChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default DateRangeFilter;
