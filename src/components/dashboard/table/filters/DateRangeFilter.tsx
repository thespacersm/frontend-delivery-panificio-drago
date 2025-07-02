import React, { useEffect, useState } from 'react';

interface DateRangeFilterProps {
    filterKey: string;
    title: string;
    value: string | { from?: string; to?: string };
    onChange: (filterKey: string, value: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
    filterKey,
    title,
    value,
    onChange,
}) => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        // Gestisce sia il caso in cui value sia una stringa che un oggetto
        if (typeof value === 'string' && value) {
            // Se value è una stringa, parsala per estrarre le date
            const dates = value.split(',');
            if (dates.length >= 1 && dates[0]) {
                const fromDateTime = dates[0].trim();
                // Converte "YYYY-MM-DD HH:mm:ss" in "YYYY-MM-DDTHH:mm"
                const formattedFrom = fromDateTime.replace(' ', 'T').slice(0, 16);
                setFromDate(formattedFrom);
            }
            if (dates.length >= 2 && dates[1]) {
                const toDateTime = dates[1].trim();
                // Converte "YYYY-MM-DD HH:mm:ss" in "YYYY-MM-DDTHH:mm"
                const formattedTo = toDateTime.replace(' ', 'T').slice(0, 16);
                setToDate(formattedTo);
            }
        } else if (typeof value === 'object' && value) {
            // Se value è un oggetto, estrai le date direttamente
            const fromFormatted = value.from ? value.from.replace(' ', 'T').slice(0, 16) : '';
            const toFormatted = value.to ? value.to.replace(' ', 'T').slice(0, 16) : '';
            setFromDate(fromFormatted);
            setToDate(toFormatted);
        } else {
            // Se value è vuoto o null, resetta i campi
            setFromDate('');
            setToDate('');
        }
    }, [value]);

    const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFromDate = e.target.value;
        setFromDate(newFromDate);

        // Converte "YYYY-MM-DDTHH:mm" in "YYYY-MM-DD HH:mm:ss"
        const fromDateTime = newFromDate ? `${newFromDate.replace('T', ' ')}:00` : '';
        const toDateTime = toDate ? `${toDate.replace('T', ' ')}:59` : '';
        const dateRangeString = [fromDateTime, toDateTime].filter(Boolean).join(',');

        onChange(filterKey, dateRangeString);
    };

    const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newToDate = e.target.value;
        setToDate(newToDate);

        // Converte "YYYY-MM-DDTHH:mm" in "YYYY-MM-DD HH:mm:ss"
        const fromDateTime = fromDate ? `${fromDate.replace('T', ' ')}:00` : '';
        const toDateTime = newToDate ? `${newToDate.replace('T', ' ')}:59` : '';
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
                        type="datetime-local"
                        className="border-gray-300 border rounded-md px-2 py-1 text-sm w-full"
                        value={fromDate}
                        onChange={handleFromDateChange}
                    />
                </div>
                <div className="flex flex-col w-1/2">
                    <label className="text-xs text-gray-500 mb-1">A</label>
                    <input
                        type="datetime-local"
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
