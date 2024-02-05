import { Accordion, Text } from '@mantine/core'
import { IconLayoutList } from '@tabler/icons-react'

import AccordionItem from '~/components/Accordion/AccordionItem'
import AccordionPanel from '~/components/Accordion/AccordionPanel'
import OtherFilter from '~/pages/SearchWithFilters/components/OtherFilter'
import type { OtherItem } from '~/pages/SearchWithFilters/types/other-filter'

import useThemeColor from '~/hooks/use-theme-color'

import { FiltersAccordionItemName } from '../../constants'

type Props = {
  items: OtherItem[] | undefined
  onItemChange: (type: string, item: OtherItem) => void
}

const OtherFilterAccordionItem = ({ items, onItemChange }: Props) => {
  const { getThemeColor } = useThemeColor()

  const icon = <IconLayoutList color={getThemeColor('dark.4')} />

  return (
    <AccordionItem value={FiltersAccordionItemName.OTHER_FILTER}>
      <Accordion.Control icon={icon}>
        <Text span>Other</Text>
      </Accordion.Control>

      <AccordionPanel>
        <OtherFilter data={items} onItemChange={onItemChange} />
      </AccordionPanel>
    </AccordionItem>
  )
}

export default OtherFilterAccordionItem
