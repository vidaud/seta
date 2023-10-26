import { useMemo, useState } from 'react'
import { ActionIcon, Badge, Text, Tooltip, Modal, Box } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconUserEdit } from '@tabler/icons-react'
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'

import type { Community } from '~/types/admin/community'
import { Status, Membership } from '~/types/admin/community'
import type { DataProps } from '~/types/data-props'

import DateTimeCell from '../../../common/components/DateTimeCell'
import UserInfo from '../../../common/components/UserInfo'
import OwnerForm from '../OwnerForm/OwnerForm'

type Props = {
  onCommunityOwnerSubmit?(communityId: string, ownerId: string): void
} & DataProps<Community[]>

const OrphansTable = ({ data, isLoading, error, onCommunityOwnerSubmit }: Props) => {
  const orphans: Community[] = data ?? []
  const [opened, { open, close }] = useDisclosure(false)
  const [editCommunityId, setEditCommunityId] = useState('')

  const handleRowEdit = (communityId: string) => {
    setEditCommunityId(communityId)

    open()
  }

  const columns = useMemo<MRT_ColumnDef<Community>[]>(
    () => [
      {
        accessorKey: 'community_id',
        header: 'Community',
        Cell: ({ cell, row }) => (
          <div>
            <Text color="dark" fw={600} size="md">
              {cell.getValue<string>()}
            </Text>
            <Text mt={10} pl={5} size="sm" c="dimmed">
              {row.original.description}
            </Text>
          </div>
        )
      },
      {
        accessorKey: 'membership',
        header: 'Membership request',
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'top'
          }
        },
        Cell: ({ cell }) => {
          const val = cell.getValue<Membership>()
          const color = val === Membership.Closed ? 'dark' : 'teal'
          const membership = val === Membership.Closed ? 'Restricted Pending' : 'Opened Request'

          return <Badge color={color}>{membership}</Badge>
        }
      },
      {
        accessorKey: 'status',
        header: 'Status',
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'top'
          }
        },
        Cell: ({ cell }) => {
          const val = cell.getValue<Status>()
          const color = val === Status.Active ? 'blue' : 'yellow'

          return <Badge color={color}>{val}</Badge>
        }
      },
      {
        accessorKey: 'creator',
        header: 'Creator',
        enableSorting: false,
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'top'
          }
        },
        Cell: ({ row }) => (
          <UserInfo
            username={row.original.creator?.user_id}
            fullName={row.original.creator?.full_name}
            email={row.original.creator?.email}
          />
        )
      },
      {
        accessorKey: 'created_at',
        header: 'Created at',
        enableSorting: false,
        mantineTableBodyCellProps: {
          style: {
            width: '1%',
            verticalAlign: 'top'
          }
        },
        Cell: ({ cell }) => <DateTimeCell dateTime={cell.getValue<Date>()} />
      }
    ],
    []
  )

  const isError = !!error

  const table = useMantineReactTable({
    columns,
    data: orphans,
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
    initialState: { sorting: [{ id: 'community_id', desc: false }] },
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
      <Tooltip label="Choose owner">
        <ActionIcon
          variant="outline"
          color="teal"
          size="md"
          onClick={() => handleRowEdit(row.original.community_id)}
        >
          <IconUserEdit stroke={1.5} />
        </ActionIcon>
      </Tooltip>
    )
  })

  const handleOwnerSubmit = (communityId?: string, ownerId?: string) => {
    close()

    if (communityId && ownerId) {
      onCommunityOwnerSubmit?.(communityId, ownerId)
    }
  }

  return (
    <Box>
      <Modal opened={opened} onClose={close} title={`Community ${editCommunityId}`} centered>
        <OwnerForm communityId={editCommunityId} onSubmit={handleOwnerSubmit} />
      </Modal>
      <MantineReactTable table={table} />
    </Box>
  )
}

export default OrphansTable
