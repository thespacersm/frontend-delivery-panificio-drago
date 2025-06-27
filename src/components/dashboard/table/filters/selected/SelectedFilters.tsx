import React from 'react';
import {Filter} from '../Filters';

interface SelectedFiltersProps {
    activeFilters: Array<{ key: string; value: any; operator: string }>;
    filters: Filter[];
    onRemove: (key: string) => void;
}

const SelectedFilters: React.FC<SelectedFiltersProps> = ({
                                                                activeFilters,
                                                                filters,
                                                                onRemove,
                                                         }) => {
    if (activeFilters.length === 0) {
        return null;
    }

    const getFilterLabel = (filter: { key: string; value: any; operator: string }): string => {
        const filterItem = filters.find(f => f.key === filter.key);
        if (!filterItem) return '';

        let valueLabel = filter.value;

        // Se è un filtro di tipo select, cerca l'etichetta corrispondente
        if (filterItem.type === 'select' && filterItem.options) {
            const option = filterItem.options.find(fi => fi.value === filter.value);
            if (option) {
                valueLabel = option.label;
            }
        }

        if (filterItem.type === 'daterange' && typeof filter.value === 'object') {
            const parts = [];
            if (filter.value.from) {
                parts.push(`da ${new Date(filter.value.from).toLocaleDateString('it-IT')}`);
            }
            if (filter.value.to) {
                parts.push(`a ${new Date(filter.value.to).toLocaleDateString('it-IT')}`);
            }
            valueLabel = parts.join(' ');
        }

        if (filterItem.type === 'date') {
            valueLabel = new Date(filter.value).toLocaleDateString('it-IT');
        }

        return `${filterItem.title}: ${valueLabel}`;
    };

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {activeFilters.map((filter) => (
                <div
                    key={filter.key}
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full flex items-center text-sm"
                >
                    <span>{getFilterLabel(filter)}</span>
                    <button
                        className="ml-2 text-primary-500 hover:text-primary-700"
                        onClick={() => onRemove(filter.key)}
                    >
                        ×
                    </button>
                </div>
            ))}

            {activeFilters.length > 0 && (
                <button
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                    onClick={() => activeFilters.forEach(filter => onRemove(filter.key))}
                >
                    Rimuovi tutti
                </button>
            )}
        </div>
    );
};

export default SelectedFilters;
