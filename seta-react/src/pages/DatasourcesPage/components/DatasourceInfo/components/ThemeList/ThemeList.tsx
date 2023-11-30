import { Badge, Group } from '@mantine/core'

import { themeColors } from '~/pages/DatasourcesPage/types'

const ThemeList = () => {
  const pills = Array(5)
    .fill(0)
    .map((_, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Badge key={index} color={themeColors[index]} radius="sm" variant="filled">
        Item {index}
      </Badge>
    ))

  return (
    <Group position="right" w="38%">
      {pills}
    </Group>
  )
}

export default ThemeList
