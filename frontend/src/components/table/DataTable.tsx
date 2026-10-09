import { useId } from 'react'
import type { ColumnDef, RowData } from '@tanstack/react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSort,
    faSortDown,
    faSortUp,
} from '@fortawesome/free-solid-svg-icons'
import Form from 'react-bootstrap/Form'
import Pagination from 'react-bootstrap/Pagination'
import Table from 'react-bootstrap/Table'
import { useAppTable, type DropletTableFeatures } from './tableHook'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const
const EMPTY_DATA: never[] = []

export type DataTableColumn<TData extends RowData> = ColumnDef<
    DropletTableFeatures,
    TData
>

export interface DataTableProps<TData extends RowData> {
    data: TData[]
    columns: Array<DataTableColumn<TData>>
    /** Defaults to 10 (DataTables default). */
    pageSize?: number
    emptyMessage?: string
    className?: string
    getRowId?: (originalRow: TData, index: number) => string
}

function sortIcon(sorted: false | 'asc' | 'desc') {
    if (sorted === 'asc') return faSortUp
    if (sorted === 'desc') return faSortDown
    return faSort
}

export function DataTable<TData extends RowData>({
    data,
    columns,
    pageSize = 10,
    emptyMessage = 'No matching records found',
    className,
    getRowId,
}: DataTableProps<TData>) {
    const searchId = useId()
    const table = useAppTable({
        columns,
        data: data.length > 0 ? data : (EMPTY_DATA as TData[]),
        getRowId,
        initialState: {
            pagination: { pageIndex: 0, pageSize },
        },
    })

    const { pageIndex, pageSize: currentPageSize } = table.state.pagination
    const globalFilter = (table.state.globalFilter as string | undefined) ?? ''
    const filteredCount = table.getFilteredRowModel().rows.length
    const totalCount = table.getCoreRowModel().rows.length
    const pageCount = table.getPageCount()
    const rows = table.getRowModel().rows

    const from = filteredCount === 0 ? 0 : pageIndex * currentPageSize + 1
    const to =
        filteredCount === 0
            ? 0
            : Math.min((pageIndex + 1) * currentPageSize, filteredCount)

    const infoText =
        filteredCount === totalCount
            ? `Showing ${from} to ${to} of ${filteredCount} entries`
            : `Showing ${from} to ${to} of ${filteredCount} entries (filtered from ${totalCount} total entries)`

    return (
        <div className={className ? `data-table ${className}` : 'data-table'}>
            <div className="data-table__toolbar d-flex flex-wrap gap-2 justify-content-between align-items-center mb-2">
                <Form.Group className="d-flex align-items-center gap-2 mb-0">
                    <Form.Label className="mb-0 text-nowrap">Show</Form.Label>
                    <Form.Select
                        size="sm"
                        style={{ width: 'auto' }}
                        value={currentPageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value))
                        }}
                        aria-label="Rows per page"
                    >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </Form.Select>
                    <span>entries</span>
                </Form.Group>

                <Form.Group className="d-flex align-items-center gap-2 mb-0">
                    <Form.Label className="mb-0" htmlFor={searchId}>
                        Search
                    </Form.Label>
                    <Form.Control
                        id={searchId}
                        size="sm"
                        type="search"
                        value={globalFilter}
                        onChange={(e) =>
                            table.setGlobalFilter(String(e.target.value))
                        }
                    />
                </Form.Group>
            </div>

            <Table responsive hover className="data-table__table mb-2">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const canSort = header.column.getCanSort()
                                const sorted = header.column.getIsSorted()
                                return (
                                    <th
                                        key={header.id}
                                        scope="col"
                                        aria-sort={
                                            sorted === 'asc'
                                                ? 'ascending'
                                                : sorted === 'desc'
                                                  ? 'descending'
                                                  : canSort
                                                    ? 'none'
                                                    : undefined
                                        }
                                    >
                                        {header.isPlaceholder ? null : canSort ? (
                                            <button
                                                type="button"
                                                className="data-table__sort-btn"
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                <table.FlexRender
                                                    header={header}
                                                />
                                                <FontAwesomeIcon
                                                    icon={sortIcon(sorted)}
                                                    className="ms-1 data-table__sort-icon"
                                                    aria-hidden
                                                />
                                            </button>
                                        ) : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={Math.max(columns.length, 1)}
                                className="text-center text-muted py-4"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <tr key={row.id}>
                                {row.getAllCells().map((cell) => (
                                    <td key={cell.id}>
                                        <table.FlexRender cell={cell} />
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <div className="data-table__footer d-flex flex-wrap gap-2 justify-content-between align-items-center">
                <div className="text-muted small">{infoText}</div>
                <Pagination className="mb-0" size="sm">
                    <Pagination.Prev
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                    />
                    {Array.from({ length: pageCount }, (_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index === pageIndex}
                            onClick={() => table.setPageIndex(index)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                    />
                </Pagination>
            </div>
        </div>
    )
}
