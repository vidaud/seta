import { Box, ScrollArea } from '@mantine/core'

import ListMenuItem from './components/ListMenuItem'

const isListOfStrings = (items: string[] | { label: string; value: string }[]): items is string[] =>
  !!items.length && typeof items[0] === 'string'

type LabelValue = {
  label: string
  value: string
}

type Props = {
  className?: string
  items: string[] | LabelValue[]
  onSelect?: (value: string) => void
}

const ListMenu = ({ className, items }: Props) => {
  const formattedItems: LabelValue[] = isListOfStrings(items)
    ? [...new Set(items.map(item => ({ label: item, value: item })))]
    : items // TODO: remove duplicates when items are not strings

  return (
    <Box className={className}>
      <ScrollArea.Autosize mah={300} type="auto">
        {formattedItems.map(item => (
          <ListMenuItem key={item.value} {...item} />
        ))}
      </ScrollArea.Autosize>
    </Box>
  )
}

export default ListMenu
