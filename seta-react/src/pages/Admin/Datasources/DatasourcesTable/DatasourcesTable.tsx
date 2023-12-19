import { useMemo } from 'react'
import { Badge, Text, Flex, ScrollArea } from '@mantine/core'
import { useMantineReactTable, MantineReactTable } from 'mantine-react-table'
import type { MRT_ColumnDef } from 'mantine-react-table'

import type { DatasourceResponse } from '~/api/types/datasource-types'
import { DatasourceStatus } from '~/types/admin/user-info'
import type { DataProps } from '~/types/data-props'

import AddDatasource from './components/AddDatasource'
import ManageScopes from './components/ManageScopes/ManageScopes'
import UpdateDatasource from './components/UpdateDatasource'

import DateTimeCell from '../../common/components/DateTimeCell'
import DetailPanel from '../DetailPanel'

const DatasourcesTable = ({ data, isLoading, error }: DataProps<DatasourceResponse[]>) => {
  const accounts: DatasourceResponse[] = data ?? []

  const columns = useMemo<MRT_ColumnDef<DatasourceResponse>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Identifier',
        enableSorting: false
      },
      {
        accessorKey: 'title',
        header: 'Title',
        filterVariant: 'multi-select',
        Cell: ({ cell }) => <Text size="sm">{cell.getValue<string>()}</Text>
      },
      {
        accessorKey: 'description',
        header: 'Description',
        filterVariant: 'multi-select',
        Cell: ({ cell }) => <Text size="sm">{cell.getValue<string>()}</Text>
      },
      {
        accessorKey: 'organisation',
        header: 'Organisation',
        filterVariant: 'multi-select',
        Cell: ({ cell }) => <Text size="sm">{cell.getValue<string>()}</Text>
      },
      {
        accessorKey: 'status',
        header: 'Status',
        filterVariant: 'multi-select',
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'top'
          }
        },
        Cell: ({ cell }) => {
          const val = cell.getValue<DatasourceStatus>()
          const color = val === DatasourceStatus.Active ? 'blue.3' : 'dark.3'

          return <Badge color={color}>{val}</Badge>
        }
      },
      {
        accessorFn: row => row.created, //convert to date for sorting and filtering
        header: 'Created at',
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'top'
          }
        },
        filterVariant: 'date-range',
        Cell: ({ cell }) => {
          return <DateTimeCell dateTime={cell.getValue<Date>()} />
        }
      }
    ],
    []
  )

  const isError = !!error

  const table = useMantineReactTable({
    columns: columns,
    data: accounts,
    enableEditing: true,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableTopToolbar: true,
    enableBottomToolbar: true,
    enableDensityToggle: false,
    enableHiding: false,
    enableFullScreenToggle: false,
    enableRowActions: true,
    enableFacetedValues: true,
    positionActionsColumn: 'last',
    positionExpandColumn: 'first',
    enablePagination: true,
    paginationDisplayMode: 'default',
    renderTopToolbarCustomActions: () => <AddDatasource />,
    mantinePaginationProps: {
      rowsPerPageOptions: ['10', '20', '50']
    },
    mantinePaperProps: {
      w: '100%'
    },
    mantineTableProps: {
      striped: false
    },
    mantineTableHeadCellProps: {
      style: {
        borderBottom: '2px solid rgb(222, 226, 230)'
      }
    },
    mantineTableBodyCellProps: {
      style: {
        verticalAlign: 'top'
      }
    },
    mantineToolbarAlertBannerProps: isError
      ? {
          color: 'red',
          children: 'Error loading data'
        }
      : undefined,
    initialState: { sorting: [{ id: 'id', desc: false }], showColumnFilters: false },
    state: { isLoading, showAlertBanner: isError },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        mantineTableBodyCellProps: {
          align: 'center',
          style: {
            width: '1%',
            verticalAlign: 'middle'
          }
        }
      },
      'mrt-row-expand': {
        mantineTableHeadCellProps: {
          width: '1%',
          align: 'center'
        },
        mantineTableBodyCellProps: {
          width: '1%',
          align: 'center'
        }
      }
    },
    renderRowActions: ({ row }) => (
      <Flex gap="md">
        <UpdateDatasource datasource={row.original} />
        <ManageScopes datasource_id={row.original.id} />
      </Flex>
    ),
    renderDetailPanel: ({ row }) => (
      <DetailPanel
        scopes={row.original.scopes}
        contactDetails={row.original.contact}
        themes={row.original.theme ? row.original.theme : '-'}
      />
    )
  })

  return (
    <ScrollArea>
      <MantineReactTable table={table} />
    </ScrollArea>
  )
}

export default DatasourcesTable
