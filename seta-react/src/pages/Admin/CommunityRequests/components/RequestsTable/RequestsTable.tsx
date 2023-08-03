import { useMemo } from 'react'
import { Text } from '@mantine/core'
import type { MRT_ColumnDef } from 'mantine-react-table'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table'

import UserInfo from '~/pages/Admin/common/components/UserInfo/UserInfo'

import type { CommunityChangeRequest } from '~/types/admin/change-requests'
import type { DataProps } from '~/types/data-props'

import ChangedPropertyCell from '../ChangedPropertyCell'
import DateTimeCell from '../DateTimeCell'
import RowActions from '../RowActions'

type Props = DataProps<CommunityChangeRequest[]> & {
  onApproveRequest?(communityId: string, requestId: string): void
  onRejectRequest?(communityId: string, requestId: string): void
}

const RequestsTable = ({ data, isLoading, error, onApproveRequest, onRejectRequest }: Props) => {
  const requests: CommunityChangeRequest[] = data ?? []

  const columns = useMemo<MRT_ColumnDef<CommunityChangeRequest>[]>(
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
        accessorKey: 'community_id',
        header: 'Community',
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
        Cell: ({ cell, row }) => (
          <ChangedPropertyCell
            fieldName={cell.getValue<string>()}
            currentValue={row.original.old_value}
            newValue={row.original.new_value}
          />
        )
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
          onApproveRequest?.(row.original.community_id, row.original.request_id)
        }}
        onReject={() => {
          onRejectRequest?.(row.original.community_id, row.original.request_id)
        }}
      />
    )
  })

  return <MantineReactTable table={table} />
}

export default RequestsTable
