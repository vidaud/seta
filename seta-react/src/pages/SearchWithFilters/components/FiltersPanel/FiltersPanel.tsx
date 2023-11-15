import { useEffect, useRef, useState } from 'react'
import { Container, Flex, Accordion, ScrollArea, rem, Text, Box } from '@mantine/core'

import AccordionItem from '~/components/Accordion/AccordionItem'
import AccordionPanel from '~/components/Accordion/AccordionPanel'

import useScrolled from '~/hooks/use-scrolled'

import { itemsReducer } from './items-reducer'
import * as S from './styles'
import TinyChart from './TinyChart'
import useClearFilter from './useClearFilter'
import useFilter from './useFilter'

import { buildFiltersContract } from '../../custom/map-query'
import type { AdvancedFilterProps } from '../../types/contracts'
import { FilterStatus } from '../../types/filter-info'
import type { RangeValue, SelectionKeys } from '../../types/filters'
import { TextChunkValues } from '../../types/filters'
import ApplyFilters from '../ApplyFilters'
import DataSourceFilter from '../DataSourceFilter'
import OtherFilter from '../OtherFilter/OtherFilter'
import TextChunkFilter from '../TextChunkFilter'
import YearsRangeFilter from '../YearsRangeFilter'

type KeyLabel = {
  key: string
  label: string
}

const FiltersPanel = ({ queryContract, onApplyFilter, onStatusChange }: AdvancedFilterProps) => {
  const [resourceSelectedKeys, setResourceSelectedKeys] = useState<SelectionKeys | null>(null)
  const [taxonomySelectedKeys, setTaxonomySelectedKeys] = useState<SelectionKeys | null>(null)

  const { scrolled: sourceScrolled, handleScrollChange: handleSourceScrollChange } = useScrolled()

  const statusChangeRef = useRef(onStatusChange)

  const {
    chunkText,
    setChunkText,
    rangeBoundaries,
    rangeValue,
    setRangeValue,
    resourceNodes,
    status,
    dispatchStatus,
    otherItems,
    dispatchOtherItems,
    filterData
  } = useFilter(queryContract, resourceSelectedKeys, taxonomySelectedKeys)

  useEffect(() => {
    statusChangeRef.current?.(status.status)
  }, [status])

  const handleApplyFilters = () => {
    const contract = buildFiltersContract({
      searchType: chunkText,
      yearsRange: rangeValue,
      selectedResources: resourceSelectedKeys,
      selectedTaxonomies: taxonomySelectedKeys,
      otherItems: otherItems
    })

    dispatchStatus({ type: 'set_status', value: FilterStatus.PROCESSING })

    onApplyFilter(contract)
  }

  const handleTextChunkChange = (value: TextChunkValues) => {
    dispatchStatus({ type: 'chunk_changed', value: TextChunkValues[value] })

    setChunkText(value)
  }

  const handleRangeChange = (value: RangeValue) => {
    dispatchStatus({ type: 'range_changed', value: value })

    setRangeValue(value)
  }

  const handleSourceSelectionChange = (value: SelectionKeys | null) => {
    let checkedKeys: KeyLabel[] | null = null

    if (value) {
      checkedKeys = []

      for (const key in value) {
        if (value[key].checked) {
          const kl = filterData.current?.sources?.find(t => t.key === key)
          const lbl = kl ? kl.label : key

          checkedKeys.push({ key: key, label: lbl })
        }
      }
    }

    dispatchStatus({
      type: 'source_changed',
      value: checkedKeys
    })

    setResourceSelectedKeys(value)
  }

  const handleTaxonomySelectionChange = (value: SelectionKeys | null) => {
    let checkedKeys: KeyLabel[] | null = null

    if (value) {
      checkedKeys = []

      for (const key in value) {
        if (value[key].checked) {
          const kl = filterData.current?.taxonomies?.find(t => t.key === key)
          const lbl = kl ? kl.label : key

          checkedKeys.push({ key: key, label: lbl })
        }
      }
    }

    dispatchStatus({
      type: 'taxonomy_changed',
      value: checkedKeys
    })

    setTaxonomySelectedKeys(value)
  }

  const handleItemChange = (type, item) => {
    dispatchOtherItems({ type: type, value: item })

    //get items for the next render
    const nextItems = itemsReducer(otherItems, { type: type, value: item })

    dispatchStatus({
      type: 'other_changed',
      value: nextItems
    })
  }

  const { handleClearFilters } = useClearFilter({
    status,
    otherItems,
    resourceSelectedKeys,
    taxonomySelectedKeys,
    dispatchStatus,
    dispatchOtherItems,
    handleTextChunkChange,
    handleSourceSelectionChange,
    handleTaxonomySelectionChange,
    handleItemChange,
    handleRangeChange
  })

  const sources = filterData?.current?.sources
  const hasSources = !!sources?.length

  // TODO: Split this into multiple components
  return (
    <Flex direction="column" align="center" gap="xl">
      <ApplyFilters
        status={status}
        onApplyFilters={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <Container w={rem(350)} css={S.chunkFilter}>
        <TextChunkFilter
          value={chunkText}
          onChange={handleTextChunkChange}
          disabled={status?.status === FilterStatus.PROCESSING}
        />
      </Container>

      <Container w={rem(350)} mb={rem(10)} css={S.dateFilter}>
        <YearsRangeFilter
          value={rangeValue}
          rangeBoundaries={rangeBoundaries}
          chartData={filterData?.current?.years}
          onValueChange={setRangeValue}
          onValueChangeEnd={handleRangeChange}
        />
      </Container>

      <Accordion
        w={rem(350)}
        chevronPosition="left"
        multiple
        defaultValue={['sources-tree', 'taxonomy-tree']}
        variant="separated"
      >
        <AccordionItem value="sources-tree" $scrolled={sourceScrolled}>
          <Accordion.Control>
            <Text span>Data sources</Text>
          </Accordion.Control>

          <AccordionPanel $withScrollArea>
            <ScrollArea.Autosize
              mx="auto"
              mih={rem(hasSources ? 180 : 60)}
              mah={rem(300)}
              onScrollPositionChange={handleSourceScrollChange}
            >
              <DataSourceFilter
                data={resourceNodes}
                selectedKeys={resourceSelectedKeys}
                onSelectionChange={handleSourceSelectionChange}
              />
            </ScrollArea.Autosize>

            {hasSources && (
              <Box css={S.sourceChart}>
                <TinyChart chartData={sources} selectedKeys={resourceSelectedKeys} />
              </Box>
            )}
          </AccordionPanel>
        </AccordionItem>

        {/* TODO: Re-enable this once the taxonomy aggregations are fixed */}
        {/* <Accordion.Item value="taxonomy-tree">
          <Accordion.Control>
            <Text span>Taxonomies</Text>
          </Accordion.Control>

          <Accordion.Panel>
            <ScrollArea.Autosize mx="auto" mah={rem(250)}>
              <TaxonomyFilter
                data={taxonomyNodes}
                selectedKeys={taxonomySelectedKeys}
                onSelectionChange={handleTaxonomySelectionChange}
              />
            </ScrollArea.Autosize>

            <TinyChart
              chartData={filterData?.current?.taxonomies}
              selectedKeys={taxonomySelectedKeys}
            />
          </Accordion.Panel>
        </Accordion.Item> */}

        <AccordionItem value="other">
          <Accordion.Control>
            <Text span>Other</Text>
          </Accordion.Control>

          <AccordionPanel>
            <OtherFilter data={otherItems} onItemChange={handleItemChange} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  )
}

export default FiltersPanel
