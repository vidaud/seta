import { Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import type { MRT_Row } from 'mantine-react-table'

import type { DatasourceResponse } from '~/api/types/datasource-types'

export const openDeleteConfirmModal = (row: MRT_Row<DatasourceResponse>) =>
  modals.openConfirmModal({
    title: 'Are you sure you want to delete this datasource?',
    children: (
      <Text>
        Are you sure you want to delete {row.original.title} datasource? This action cannot be
        undone.
      </Text>
    ),
    labels: { confirm: 'Delete', cancel: 'Cancel' },
    confirmProps: { color: 'red' }
    //   onConfirm: () => deleteDatasource(row.original.id)
  })
