import React, {useEffect, useState} from 'react';
import NumberFilter from './NumberFilter';
import TextFilter from './TextFilter';
import SelectFilter from './SelectFilter';
import DateFilter from './DateFilter';
import SelectedFilters from './selected/SelectedFilters';
import RestFilter from '@/types/RestFilter';

export type FilterType = 'text' | 'number' | 'select' | 'date';

export interface Filter {
    key: string;
    title: string;
    type: FilterType;
    options?: { value: string | number; label: string }[]; // Per i filtri select
}

interface FiltersProps {
    filters: Filter[];
    activeFilters: any[];
    onFilterChange: (filters: any[]) => void;
}

const Filters: React.FC<FiltersProps> = ({
    filters,
                                             activeFilters,
                                             onFilterChange
                                         }) => {
    // Stato locale per tenere traccia dei filtri modificati ma non ancora applicati
    const [pendingFilters, setPendingFilters] = useState<any[]>([]);

    // Inizializza i filtri pendenti con i filtri attivi quando cambiano
    useEffect(() => {
        setPendingFilters([...activeFilters]);
    }, [activeFilters]);

    const handleFilterUpdate = (key: string, value: any) => {
        // Aggiorna solo i filtri pendenti, non quelli attivi
        setPendingFilters(current => {
            // Rimuovi il filtro esistente se presente
            const updatedFilters = current.filter(f => f.key !== key);

            // Aggiungi il nuovo filtro se il valore non è vuoto
            if (value !== '' && value !== null && value !== undefined) {
                const filterItem = filters.find(f => f.key === key);
                // Imposta l'operatore in base al tipo di filtro
                // const operator = filterOption?.type === 'text' ? 'contains' : '=';
                const compare = filterItem?.type === 'text' ? 'LIKE' : '=';

                let type = ''
                if (filterItem?.type === 'text') {
                    type = 'CHAR'
                } else if (filterItem?.type === 'number') {
                    type = 'NUMERIC'
                }


                const newFilter = {key, value, compare, type} as RestFilter;

                updatedFilters.push(newFilter);
            }

            return updatedFilters;
        });
    };

    // Funzione per applicare tutti i filtri pendenti
    const applyFilters = () => {
        onFilterChange(pendingFilters);
    };

    // Funzione per rimuovere immediatamente un filtro
    const handleRemoveFilter = (key: string) => {
        // Aggiorna i filtri pendenti
        const updatedFilters = pendingFilters.filter(f => f.key !== key);
        setPendingFilters(updatedFilters);

        // Applica immediatamente il cambiamento
        onFilterChange(updatedFilters);
    };

    return (
        <div className="mb-2 flex flex-col">
            <div className="flex flex-wrap gap-4 items-end">
                {filters.map((filter) => {
                    const currentValue = pendingFilters.find(f => f.key === filter.key)?.value || '';

                    switch (filter.type) {
                        case 'text':
                            return (
                                <TextFilter
                                    key={filter.key}
                                    filterKey={filter.key}
                                    title={filter.title}
                                    value={currentValue}
                                    onChange={handleFilterUpdate}
                                />
                            );
                        case 'number':
                            return (
                                <NumberFilter
                                    key={filter.key}
                                    filterKey={filter.key}
                                    title={filter.title}
                                    value={currentValue}
                                    onChange={handleFilterUpdate}
                                />
                            );
                        case 'select':
                            return (
                                <SelectFilter
                                    key={filter.key}
                                    filterKey={filter.key}
                                    title={filter.title}
                                    value={currentValue}
                                    options={filter.options || []}
                                    onChange={handleFilterUpdate}
                                />
                            );
                        case 'date':
                            return (
                                <DateFilter
                                    key={filter.key}
                                    filterKey={filter.key}
                                    title={filter.title}
                                    value={currentValue}
                                    onChange={handleFilterUpdate}
                                />
                            );
                        default:
                            return null;
                    }
                })}

                <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-black text-white text-xs rounded-md hover:bg-primary-700 cursor-pointer transition-colors"
                >
                    Filtra
                </button>
            </div>

            <SelectedFilters
                activeFilters={activeFilters}
                filters={filters}
                onRemove={handleRemoveFilter}
            />
        </div>
    );
};

export default Filters;
