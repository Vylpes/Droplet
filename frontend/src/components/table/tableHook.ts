import {
    columnFilteringFeature,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTableHook,
    filterFn_includesString,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
    sortFns,
    tableFeatures,
} from '@tanstack/react-table'

/**
 * Shared TanStack Table features for Droplet list/view tables (#350).
 * Mirrors former jQuery DataTables defaults: sort, global search, pagination.
 */
export const dropletTableFeatures = tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    rowSortingFeature,
    rowPaginationFeature,
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filterFns: { includesString: filterFn_includesString },
    sortFns,
})

export const { createAppColumnHelper, useAppTable, useTableContext, appFeatures } =
    createTableHook({
        features: dropletTableFeatures,
        globalFilterFn: 'includesString',
    })

export type DropletTableFeatures = typeof dropletTableFeatures
