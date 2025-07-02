import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import NumberFilter from './NumberFilter';
import TextFilter from './TextFilter';
import SelectFilter from './SelectFilter';
import DateFilter from './DateFilter';
import DateRangeFilter from './DateRangeFilter';
import SelectedFilters from './selected/SelectedFilters';
import RestFilter from '@/types/RestFilter';

export type FilterType = 'text' | 'number' | 'select' | 'date' | 'daterange';

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
    // Stato per la visibilità dei filtri su mobile
    const [showMobileFilters, setShowMobileFilters] = useState(false);

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
                
                // Gestione speciale per daterange
                if (filterItem?.type === 'daterange') {

                    console.log('Daterange filter value:', value);
                    const newFilter = {
                        key,
                        value,
                        compare: 'BETWEEN',
                        type: 'DATE'
                    } as RestFilter;

                    console.log('New daterange filter:', newFilter);

                    updatedFilters.push(newFilter);
                } else {
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
            {/* Toggle button per mobile */}
            <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 mb-3 bg-gray-200 text-gray-600 text-sm rounded-full hover:bg-gray-300 transition-colors w-fit shadow-sm border border-gray-300"
            >
                <FontAwesomeIcon icon={faBars} className="text-xs" />
                <span className="font-medium">Filtri</span>
            </button>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 items-end ${showMobileFilters ? 'block' : 'hidden lg:grid'}`}>
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
                        case 'daterange':
                            return (
                                <DateRangeFilter
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
                    className="px-4 py-2 bg-black text-white text-xs rounded-md hover:bg-primary-700 cursor-pointer transition-colors w-full sm:w-auto"
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
