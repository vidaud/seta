import { Accordion, ScrollArea, Text, rem } from '@mantine/core'
import type TreeNode from 'primereact/treenode'

import AccordionItem from '~/components/Accordion/AccordionItem'
import AccordionPanel from '~/components/Accordion/AccordionPanel'
import TaxonomyFilter from '~/pages/SearchWithFilters/components/TaxonomyFilter'
import TinyChart from '~/pages/SearchWithFilters/components/TinyChart'
import type { FilterData } from '~/pages/SearchWithFilters/types/filter-data'
import type { SelectionKeys } from '~/pages/SearchWithFilters/types/filters'

import useScrolled from '~/hooks/use-scrolled'

import { FiltersAccordionItemName } from '../../constants'

type Props = {
  data: TreeNode[] | undefined
  taxonomies: FilterData[] | undefined
  selectedKeys: SelectionKeys | null | undefined
  onSelectionChange: (keys: SelectionKeys) => void
}

const TaxonomyTreeAccordionItem = ({
  data,
  taxonomies,
  selectedKeys,
  onSelectionChange
}: Props) => {
  const { scrolled, handleScrollChange: handleSourceScrollChange } = useScrolled()

  return (
    <AccordionItem value={FiltersAccordionItemName.TAXONOMY_TREE} $scrolled={scrolled}>
      <Accordion.Control>
        <Text span>Taxonomies</Text>
      </Accordion.Control>

      <AccordionPanel $withScrollArea>
        <ScrollArea.Autosize
          mx="auto"
          mah={rem(250)}
          onScrollPositionChange={handleSourceScrollChange}
        >
          <TaxonomyFilter
            data={data}
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
          />
        </ScrollArea.Autosize>

        <TinyChart chartData={taxonomies} selectedKeys={selectedKeys} />
      </AccordionPanel>
    </AccordionItem>
  )
}

export default TaxonomyTreeAccordionItem
