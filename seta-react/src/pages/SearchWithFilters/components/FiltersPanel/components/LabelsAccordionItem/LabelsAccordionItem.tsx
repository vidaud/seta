import { useRef } from 'react'
import { Accordion, Text } from '@mantine/core'
import { IconTag } from '@tabler/icons-react'

import AccordionItem from '~/components/Accordion/AccordionItem'
import AccordionPanel from '~/components/Accordion/AccordionPanel'
import UnderDevelopment from '~/components/UnderDevelopment'
import { FiltersAccordionItemName } from '~/pages/SearchWithFilters/components/FiltersPanel/constants'
import LabelsFilter from '~/pages/SearchWithFilters/components/LabelsFilter'

import useThemeColor from '~/hooks/use-theme-color'
import type { Label } from '~/types/filters/label'

import * as S from './styles'

// Delay in ms to focus the search input after the accordion item is opened
const FOCUS_DELAY = 300

type Props = {
  selectedLabels: Label[]
  onSelectedLabelsChange: (labels: Label[]) => void
}

const LabelsAccordionItem = ({ selectedLabels, onSelectedLabelsChange }: Props) => {
  const { getThemeColor } = useThemeColor()

  const inputRef = useRef<HTMLInputElement>(null)

  const handleItemClick = () => {
    // Focus the search input after the accordion item is opened
    setTimeout(() => {
      inputRef.current?.focus()
    }, FOCUS_DELAY)
  }

  const icon = <IconTag color={getThemeColor('pink')} />

  return (
    <AccordionItem value={FiltersAccordionItemName.LABELS}>
      <Accordion.Control icon={icon} onClick={handleItemClick}>
        <Text span>Annotations</Text>
      </Accordion.Control>

      <AccordionPanel $withScrollArea css={S.container}>
        <LabelsFilter
          selectedLabels={selectedLabels}
          onSelectedChange={onSelectedLabelsChange}
          inputRef={inputRef}
        />

        <UnderDevelopment variant="under-development" radius={0} />
      </AccordionPanel>
    </AccordionItem>
  )
}

export default LabelsAccordionItem
