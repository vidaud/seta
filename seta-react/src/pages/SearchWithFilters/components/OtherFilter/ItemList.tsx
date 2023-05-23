import { Grid, Text, Box, Tooltip, ActionIcon, Center, Divider } from '@mantine/core'
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
          <Center>
            <Text span fw={500}>
              {item.name}
            </Text>
          </Center>
        </Grid.Col>
        <Grid.Col span={1}>
          <Center>
            <Text span fw={700}>
              :
            </Text>
          </Center>
        </Grid.Col>
        <Grid.Col span={5}>
          <Center>
            <Text span fw={500}>
              {item.value}
            </Text>
          </Center>
        </Grid.Col>
        <Grid.Col span={1}>
          <Tooltip label="Delete item" withinPortal>
            <ActionIcon onClick={handleClick} color="red">
              <IconTrash size="1rem" stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Grid.Col>
        <Grid.Col span={12} pt={0}>
          <Divider variant="dotted" />
        </Grid.Col>
      </Grid>
    )
  })

  return (
    <Box>
      {visibleItems !== undefined && visibleItems.length > 0 && <Divider mt={10} mb={5} />}
      {listItems}
    </Box>
  )
}

export default ItemList
