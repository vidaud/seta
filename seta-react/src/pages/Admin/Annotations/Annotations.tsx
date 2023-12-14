import { Button, Group, Paper, Table, Tooltip } from '@mantine/core'

import { SuggestionsEmpty, SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useAnnotations } from '~/api/admin/annotations'

import AddAnnotation from './components/AddAnnotation/AddAnnotation'
import DeleteAnnotation from './components/DeleteAnnotation'
import UpdateAnnotation from './components/UpdateAnnotation/UpdateAnnotation'
import * as S from './styles'

import ApiLoader from '../common/components/Loader/ApiLoader'

const Annotations = () => {
  const { data, isLoading, error, refetch } = useAnnotations()

  if (error) {
    return <SuggestionsError subject="annotation" onTryAgain={refetch} />
  }

  if (isLoading) {
    return <ApiLoader />
  }

  if (!data || data.length === 0) {
    return <SuggestionsEmpty message="No annotations available!" />
  }

  const rows = data?.map(item => (
    <tr key={item.label}>
      <td>{item.label}</td>
      <td>{item.category?.category_name ? item.category?.category_name : '-'}</td>
      <td>
        <Tooltip label={item.color_code}>
          <Button sx={{ backgroundColor: String(item.color_code) }} />
        </Tooltip>
      </td>
      <td>
        <Group sx={{ justifyContent: 'center' }}>
          <UpdateAnnotation annotation={item} />
          <DeleteAnnotation annotation={item} />
        </Group>
      </td>
    </tr>
  ))

  return (
    <Paper p="sm" w="96%" radius="sm" shadow="sm" withBorder>
      <Table>
        <thead>
          <tr>
            <th>Annotation</th>
            <th>Category</th>
            <th>Color</th>
            <th style={{ width: '11rem' }}>
              <AddAnnotation />
            </th>
          </tr>
        </thead>
        <tbody css={S.tbody}>{rows}</tbody>
      </Table>
    </Paper>
  )
}

export default Annotations
