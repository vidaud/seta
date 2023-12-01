import { Badge, Group } from '@mantine/core'

import { themeColors } from '~/pages/DatasourcesPage/types'

type Props = {
  themes: string
}

const ThemeList = ({ themes }: Props) => {
  const pills = themes?.split(',').map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Badge key={index} color={themeColors[index]} radius="sm" variant="filled">
      {item}
    </Badge>
  ))

  return (
    <Group position="right" w="38%">
      {pills}
    </Group>
  )
}

export default ThemeList
