import { Grid, Text, Box, Tooltip, ActionIcon, Center } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

import type { OtherItem } from '../../types/other-filter'
import { OtherItemStatus } from '../../types/other-filter'

type Props = {
  data?: OtherItem[]
  onDeleteItem?(item: OtherItem): void
}

const ItemList = ({ data, onDeleteItem }: Props) => {
  const visibleItems = data?.filter(i => i.status !== OtherItemStatus.DELETED)

  const listItems = visibleItems?.map(item => {
    const handleClick = event => {
      event.stopPropagation()

      onDeleteItem?.(item)
    }

    return (
      <Grid key={item.id} gutter="xs" align="center">
        <Grid.Col span={5}>
          <Text span>{item.name}</Text>
        </Grid.Col>
        <Grid.Col span={1}>
          <Center>
            <Text span fw={700}>
              :
            </Text>
          </Center>
        </Grid.Col>
        <Grid.Col span={5}>
          <Text span>{item.value}</Text>
        </Grid.Col>
        <Grid.Col span={1}>
          <Tooltip label="Delete item" withinPortal>
            <ActionIcon onClick={handleClick}>
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Grid.Col>
      </Grid>
    )
  })

  return <Box>{listItems}</Box>
}

export default ItemList
