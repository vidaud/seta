import { useMemo } from 'react'
import { ActionIcon, Anchor, Badge, Group, Tooltip, Text } from '@mantine/core'
import { IconUserCircle } from '@tabler/icons-react'
import { useMantineReactTable, type MRT_ColumnDef, MantineReactTable } from 'mantine-react-table'
import moment from 'moment'
import { Link } from 'react-router-dom'

import type { SetaAccount } from '~/types/admin/user-info'
import { AccountStatus, UserRole } from '~/types/admin/user-info'
import type { DataProps } from '~/types/data-props'

import DetailPanel from '../DetailPanel'

const UsersTable = ({ data, isLoading, error }: DataProps<SetaAccount[]>) => {
  const accounts: SetaAccount[] = data ?? []

  const columns = useMemo<MRT_ColumnDef<SetaAccount>[]>(
    () => [
      {
        accessorKey: 'email',
        header: 'Email',
        filterVariant: 'autocomplete',
        Cell: ({ cell }) => (
          <Anchor component="button" size="sm">
            {cell.getValue<string>()}
          </Anchor>
        )
      },
      {
        accessorKey: 'role',
        header: 'Role',
        filterVariant: 'multi-select',
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'top'
          }
        },
        Cell: ({ cell }) => {
          const val = cell.getValue<UserRole>()
          const color = val === UserRole.Administrator ? 'orange' : 'cyan'

          return (
            <Badge color={color} variant="outline">
              {val}
            </Badge>
          )
        }
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
          const val = cell.getValue<AccountStatus>()
          const color = val === AccountStatus.Active ? 'blue' : 'gray'

          return <Badge color={color}>{val}</Badge>
        }
      },
      {
        accessorFn: row => new Date(row.createdAt), //convert to date for sorting and filtering
        header: 'Created at',
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'top'
          }
        },
        filterVariant: 'date-range',
        Cell: ({ cell }) => {
          const dateTime = cell.getValue<Date>()

          const date = moment.utc(dateTime).local().format('YYYY-MM-DD')
          const time = moment.utc(dateTime).local().format('HH:mm')

          return (
            <Group align="flex-start" spacing="sm">
              <Text>{date}</Text>
              <Text c="dimmed">{time}</Text>
            </Group>
          )
        }
      },
      {
        accessorKey: 'username',
        header: 'Identifier',
        enableSorting: false
      }
    ],
    []
  )

  const isError = !!error

  const table = useMantineReactTable({
    columns,
    data: accounts,
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
    mantinePaginationProps: {
      rowsPerPageOptions: ['10', '20', '50']
    },
    mantinePaperProps: {
      w: '100%'
    },
    mantineTableProps: {
      striped: true
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
    initialState: { sorting: [{ id: 'email', desc: false }], showColumnFilters: false },
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
      <Tooltip label="Manage account">
        <ActionIcon
          variant="outline"
          color="blue"
          component={Link}
          to={`/admin/users/${row.original.username}`}
        >
          <IconUserCircle stroke={1.5} size="sm" />
        </ActionIcon>
      </Tooltip>
    ),
    renderDetailPanel: ({ row }) => (
      <DetailPanel
        externalProviders={row.original.externalProviders}
        details={row.original.details}
      />
    )
  })

  return <MantineReactTable table={table} />
}

export default UsersTable
