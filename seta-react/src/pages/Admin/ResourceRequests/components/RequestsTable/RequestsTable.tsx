import { useMemo } from 'react'
import { Text } from '@mantine/core'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table'

import ChangedPropertyCell from '~/pages/Admin/common/components/ChangedPropertyCell'
import DateTimeCell from '~/pages/Admin/common/components/DateTimeCell'
import RowActions from '~/pages/Admin/common/components/RequestRowActions'
import UserInfo from '~/pages/Admin/common/components/UserInfo'

import type { ResourceChangeRequest } from '~/types/admin/change-requests'
import type { DataProps } from '~/types/data-props'

import LimitsPropertyCell from '../LimitsPropertyCell/LimitsPropertyCell'

type Props = DataProps<ResourceChangeRequest[]> & {
  onApproveRequest?(resourceId: string, requestId: string): void
  onRejectRequest?(resourceId: string, requestId: string): void
}

const RequestsTable = ({ data, isLoading, error, onApproveRequest, onRejectRequest }: Props) => {
  const requests: ResourceChangeRequest[] = data ?? []

  const columns = useMemo<MRT_ColumnDef<ResourceChangeRequest>[]>(
    () => [
      {
        accessorKey: 'initiated_date',
        header: 'Date',
        //accessorFn: row => `${moment.utc(row.initiated_date).local().format('YYYY-MM-DD HH:mm')}`,
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'top'
          }
        },
        Cell: ({ cell }) => <DateTimeCell dateTime={cell.getValue<Date>()} />
      },
      {
        accessorKey: 'resource_id',
        header: 'Resource',
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'top'
          }
        },
        Cell: ({ cell }) => (
          <Text color="dark" fw={600} size="md">
            {cell.getValue<string>()}
          </Text>
        )
      },
      {
        accessorKey: 'requested_by',
        header: 'Initiator',
        enableSorting: false,
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'top'
          }
        },
        Cell: ({ cell, row }) => (
          <UserInfo
            username={cell.getValue<string>()}
            fullName={row.original.requested_by_info?.full_name}
            email={row.original.requested_by_info?.email}
          />
        )
      },
      {
        accessorKey: 'field_name',
        header: 'Changed property',
        enableSorting: false,
        mantineTableBodyCellProps: {
          style: {
            width: 'auto',
            verticalAlign: 'top'
          }
        },
        Cell: ({ cell, row }) => {
          const prop = cell.getValue<string>()

          if (prop.toLowerCase() === 'limits') {
            return (
              <LimitsPropertyCell
                fieldName={cell.getValue<string>()}
                currentValue={row.original.old_value}
                newValue={row.original.new_value}
              />
            )
          }

          return (
            <ChangedPropertyCell
              fieldName={cell.getValue<string>()}
              currentValue={row.original.old_value}
              newValue={row.original.new_value}
            />
          )
        }
      }
    ],
    []
  )

  const isError = !!error

  const table = useMantineReactTable({
    columns,
    data: requests,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableRowActions: true,
    positionActionsColumn: 'last',
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
    initialState: { sorting: [{ id: 'initiated_date', desc: false }] },
    state: { isLoading, showAlertBanner: isError },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'middle'
          }
        }
      }
    },
    renderRowActions: ({ row }) => (
      <RowActions
        onApprove={() => {
          onApproveRequest?.(row.original.resource_id, row.original.request_id)
        }}
        onReject={() => {
          onRejectRequest?.(row.original.resource_id, row.original.request_id)
        }}
      />
    )
  })

  return <MantineReactTable table={table} />
}

export default RequestsTable
