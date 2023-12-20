import { Badge, Group } from '@mantine/core'

import { themeColors } from '~/pages/DatasourcesPage/types'

type Props = {
  themes: string[]
  width?: string
}

const ThemeList = ({ themes, width }: Props) => {
  const pills = themes?.map((item, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Badge key={index} color={themeColors[index]} fz="sm" radius="sm" variant="filled">
      {item}
    </Badge>
  ))

  return (
    <Group position="right" w={width}>
      {pills}
    </Group>
  )
}

export default ThemeList
