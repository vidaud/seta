import { Button, Flex, Group, Paper, Table, Tooltip, Text } from '@mantine/core'

import { SuggestionsError } from '~/pages/SearchPageNew/components/common'

import { useAnnotations } from '~/api/admin/annotations'

import DeleteAnnotation from './components/DeleteAnnotation'
import OptionsMenuAction from './components/OptionsMenuAction'
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

  const rows = data?.map(item => (
    <tr key={item.label}>
      <td>{item.label}</td>
      <td>{item.category ? item.category : '-'}</td>
      <td>
        <Tooltip label={item.color}>
          <Button
            sx={{
              backgroundColor: String(item.color),
              '&:hover': { backgroundColor: String(item.color) }
            }}
          />
        </Tooltip>
      </td>
      <td>
        <Group sx={{ justifyContent: 'center' }}>
          <UpdateAnnotation annotation={item} />
          <DeleteAnnotation annotation={item} />
          <OptionsMenuAction item={item} />
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
            <th style={{ width: '10rem' }}>
              <Group position="right">
                <OptionsMenuAction data={data} />
              </Group>
            </th>
          </tr>
        </thead>
        {rows && rows?.length > 0 ? (
          <tbody css={S.tbody}>{rows}</tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={4}>
                <Flex align="center" justify="center" gap="sm" mt="xs">
                  <Text fz="sm" color="gray">
                    No annotations available!
                  </Text>
                </Flex>
              </td>
            </tr>
          </tbody>
        )}
      </Table>
    </Paper>
  )
}

export default Annotations
