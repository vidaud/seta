import { Accordion, Box, ScrollArea, Text, rem } from '@mantine/core'
import { IconDatabase } from '@tabler/icons-react'

import AccordionItem from '~/components/Accordion/AccordionItem'
import AccordionPanel from '~/components/Accordion/AccordionPanel'
import DataSourceFilter from '~/pages/SearchWithFilters/components/DataSourceFilter'
import type { DataSourceFilterProps } from '~/pages/SearchWithFilters/components/DataSourceFilter'
import TinyChart from '~/pages/SearchWithFilters/components/TinyChart'
import type { FilterData } from '~/pages/SearchWithFilters/types/filter-data'

import useScrolled from '~/hooks/use-scrolled'
import useThemeColor from '~/hooks/use-theme-color'

import * as S from './styles'

import { FiltersAccordionItemName } from '../../constants'

type Props = DataSourceFilterProps & {
  sources: FilterData[] | undefined
}

const DataSourceAccordionItem = ({ data, sources, selectedKeys, onSelectionChange }: Props) => {
  const { getThemeColor } = useThemeColor()
  const { scrolled, handleScrollChange: handleSourceScrollChange } = useScrolled()

  const hasSources = !!sources?.length

  const icon = <IconDatabase color={getThemeColor('blue')} />

  return (
    <AccordionItem value={FiltersAccordionItemName.DATA_SOURCE} $scrolled={scrolled}>
      <Accordion.Control icon={icon}>
        <Text span>Data Sources</Text>
      </Accordion.Control>

      <AccordionPanel $withScrollArea>
        <ScrollArea.Autosize
          mx="auto"
          mih={rem(60)}
          mah={rem(300)}
          onScrollPositionChange={handleSourceScrollChange}
        >
          <DataSourceFilter
            data={data}
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
          />
        </ScrollArea.Autosize>

        {hasSources && (
          <Box css={S.sourceChart}>
            <TinyChart chartData={sources} selectedKeys={selectedKeys} />
          </Box>
        )}
      </AccordionPanel>
    </AccordionItem>
  )
}

export default DataSourceAccordionItem
