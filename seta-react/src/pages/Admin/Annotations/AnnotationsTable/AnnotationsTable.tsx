/* eslint-disable react/jsx-pascal-case */
import { useMemo } from 'react'
import { Text, Flex, ScrollArea, Button } from '@mantine/core'
import {
  useMantineReactTable,
  MantineReactTable,
  MRT_ToggleFiltersButton,
  MRT_ToggleGlobalFilterButton
} from 'mantine-react-table'
import type { MRT_ColumnDef } from 'mantine-react-table'

import type { AnnotationResponse } from '~/api/types/annotations-types'
import type { DataProps } from '~/types/data-props'

import AddAnnotation from '../components/AddAnnotation'
import DeleteAnnotation from '../components/DeleteAnnotation'
import OptionsMenuAction from '../components/OptionsMenuAction'
import UpdateAnnotation from '../components/UpdateAnnotation'

const AnnotationsTable = ({ data, isLoading, error }: DataProps<AnnotationResponse[]>) => {
  const accounts: AnnotationResponse[] = data ?? []

  const columns = useMemo<MRT_ColumnDef<AnnotationResponse>[]>(
    () => [
      {
        accessorKey: 'label',
        header: 'Label',
        filterVariant: 'multi-select'
      },
      {
        accessorKey: 'category',
        header: 'Category',
        filterVariant: 'multi-select',
        Cell: ({ cell }) => <Text size="sm">{cell.getValue<string>()}</Text>
      },
      {
        accessorKey: 'color',
        header: 'Color',
        filterVariant: 'multi-select',
        Cell: ({ cell }) => (
          <Button
            size="sm"
            sx={{
              backgroundColor: String(cell.getValue<string>()),
              '&:hover': { backgroundColor: String(cell.getValue<string>()) }
            }}
          />
        )
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
    // eslint-disable-next-line @typescript-eslint/no-shadow
    renderToolbarInternalActions: ({ table }) => (
      <>
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ToggleGlobalFilterButton table={table} />
        <OptionsMenuAction data={data} />
      </>
    ),
    positionActionsColumn: 'last',
    positionExpandColumn: 'first',
    enablePagination: true,
    paginationDisplayMode: 'default',
    renderBottomToolbarCustomActions: () => <AddAnnotation />,
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
    initialState: { sorting: [{ id: 'label', desc: false }], showColumnFilters: false },
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
        <UpdateAnnotation annotation={row.original} />
        <DeleteAnnotation annotation={row.original} />
        <OptionsMenuAction item={row.original} />
      </Flex>
    )
  })

  return (
    <ScrollArea>
      <MantineReactTable table={table} />
    </ScrollArea>
  )
}

export default AnnotationsTable
