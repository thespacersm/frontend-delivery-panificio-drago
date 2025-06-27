import React, {useCallback, useEffect, useState} from 'react';
import {ActionType, PagingPosition, SortingMode, Table, useTable} from 'ka-table';
import 'ka-table/style.css'; // Import default ka-table styles
import '@/styles/ka-table-responsive.css'; // Import responsive styles
import Filters, {Filter} from './filters/Filters';

interface KaTableProps<T> {
    fetchData: (
        pageIndex: number,
        pageSize: number,
        orderBy: string,
        order: string,
        filters: any[]
    ) => Promise<{
        data: T[];
        totalPages: number;
    }>;
    columns: Array<{
        key: string;
        title: string;
        render?: (value: any, row: T) => React.ReactNode; // Funzione di rendering personalizzata
        [key: string]: any;
    }> & { render?: (value: any, row: T) => React.ReactNode };
    rowKeyField: string;
    actions?: Array<(props: { row: T }) => React.ReactNode>;
    filters?: Filter[];
    defaultPageSize?: number;
    pageSizes?: number[];
    refreshIndex?: number;
}

const KaTable = <T extends object>({
                                       fetchData,
                                       columns,
                                       rowKeyField = 'id',
                                       actions = [],
                                       filters = [], // Default è un array vuoto
                                        defaultPageSize = 10, // Default a 10
                                        pageSizes = [5, 10, 20], // Default page sizes
                                       refreshIndex = 0, // Default a 0
                                   }: KaTableProps<T>) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [orderBy, setOrderBy] = useState('id');
    const [order, setOrder] = useState('desc');
    const [activeFilters, setActiveFilters] = useState<any>([]);
    const [pagesCount, setPagesCount] = useState(0);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await fetchData(
                pageIndex,
                pageSize,
                orderBy,
                order,
                activeFilters
            );
            setData(result.data);
            setPagesCount(result.totalPages);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [fetchData, pageIndex, pageSize, orderBy, order, activeFilters, refreshIndex]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleFilterChange = (newFilters: any[]) => {
        setActiveFilters(newFilters);
        setPageIndex(0); // Reset to first page when filters change
    };

    const table = useTable({
        onDispatch: (action) => {
            if (action.type === ActionType.UpdatePageIndex) {
                setPageIndex(action.pageIndex);
            }
            if (action.type === ActionType.UpdatePageSize) {
                setPageSize(action.pageSize);
            }
            if (action.type === ActionType.UpdateSortDirection) {
                let columnKey = action.columnKey;
                if (columnKey === 'title.rendered') {
                    columnKey = 'title';
                }
                if (columnKey.startsWith('acf.')) {
                    columnKey = columnKey.replace('acf.', '');
                }
                // Se la colonna è già ordinata, inverte l'ordine, altrimenti inizia con 'asc'
                if (orderBy === columnKey) {
                    setOrder(order === 'asc' ? 'desc' : 'asc');
                } else {
                    setOrderBy(columnKey);
                    setOrder('asc');
                }
            }
        }
    });

    // Prepara le colonne includendo la colonna delle azioni se necessario
    let tableColumns = [
        ...columns
    ];

    tableColumns = tableColumns.map(column => ({
        ...column,
        // Applica sortDirection solo se questa è la colonna correntemente ordinata
        sortDirection: orderBy === column.key ||
        (column.key === 'title.rendered' && orderBy === 'title') ||
        (column.key.startsWith('acf.') && orderBy === column.key.replace('acf.', ''))
            ? order === 'asc' ? "ascend" : "descend"
            : undefined
    }));


    if (actions.length > 0) {
        tableColumns.push({
            key: 'actions',
            title: 'Azioni',
            width: 120,
            isSortable: false,
        });
    }

    // Componente personalizzato per la cella delle azioni
    const ActionsCell = ({rowData}: { rowData: T }) => (
        <div className="flex">
            {actions.map((Action, index) => (
                <Action key={index} row={rowData}/>
            ))}
        </div>
    );

    return (
        <>
            {/* Aggiungi il componente Filters se ci sono filtri disponibili */}
            {filters.length > 0 && (
                <Filters
                    filters={filters}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                />
            )}

            {!loading && data.length === 0 ? (
                <div className="text-center py-10 rounded-md">
                    <p className="text-gray-500 text-lg">Nessun risultato trovato</p>
                </div>
            ) : (
                <Table
                    table={table}
                    data={data}
                    columns={tableColumns}
                    rowKeyField={rowKeyField}
                    loading={{
                        enabled: loading,
                        text: 'Loading...',
                    }}
                    sortingMode={SortingMode.Single}
                    paging={{
                        enabled: true,
                        pageIndex: pageIndex,
                        pageSize: pageSize,
                        pageSizes: pageSizes,
                        position: PagingPosition.Bottom,
                        pagesCount: pagesCount,
                    }}
                    childComponents={{
                        cellText: {
                            content: (props) => {
                                if (props.column.key === 'actions') {
                                    return <ActionsCell rowData={props.rowData}/>;
                                }
                                
                                // Gestisce il rendering personalizzato se la colonna ha una funzione render
                                if ('render' in props.column && props.column.render) {
                                    const value = props.value;
                                    return typeof props.column.render === 'function'
                                        ? props.column.render(value, props.rowData)
                                        : undefined;
                                }
                                
                                // Altrimenti lascia che ka-table gestisca il rendering predefinito
                                return undefined;
                            }
                        },
                        cell: {
                            elementAttributes: ({column}) => ({
                                'data-column': column.title
                            } as any)
                        }
                    }}
                />
            )}
        </>
    );
};

export default KaTable;
