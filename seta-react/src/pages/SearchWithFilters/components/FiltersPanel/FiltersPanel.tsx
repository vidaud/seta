import { useEffect, useRef, useState } from 'react'
import { Container, Flex, Accordion, ScrollArea, Indicator, rem, Text } from '@mantine/core'

import { itemsReducer } from './items-reducer'
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
import TaxonomyFilter from '../TaxonomyFilter'
import TextChunkFilter from '../TextChunkFilter'
import YearsRangeFilter from '../YearsRangeFilter'

const FiltersPanel = ({ queryContract, onApplyFilter, onStatusChange }: AdvancedFilterProps) => {
  const [resourceSelectedKeys, setResourceSelectedKeys] = useState<SelectionKeys | null>(null)
  const [taxonomySelectedKeys, setTaxonomySelectedKeys] = useState<SelectionKeys | null>(null)

  const statusChangeRef = useRef(onStatusChange)

  const {
    chunkText,
    setChunkText,
    enableDateFilter,
    setEnableDateFilter,
    rangeBoundaries,
    rangeValue,
    setRangeValue,
    resourceNodes,
    taxonomyNodes,
    status,
    dispatchStatus,
    otherItems,
    dispatchOtherItems
  } = useFilter(queryContract, resourceSelectedKeys, taxonomySelectedKeys)

  useEffect(() => {
    statusChangeRef.current?.(status.status)
  }, [status])

  const handleApplyFilters = () => {
    const contract = buildFiltersContract({
      searchType: chunkText,
      yearsRange: enableDateFilter ? rangeValue : undefined,
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
  }

  const handleSourceSelectionChange = (value: SelectionKeys | null) => {
    dispatchStatus({
      type: 'source_changed',
      value: value ? Object.keys(value) : null
    })

    setResourceSelectedKeys(value)
  }

  const handleTaxonomySelectionChange = (value: SelectionKeys | null) => {
    dispatchStatus({
      type: 'taxonomy_changed',
      value: value ? Object.keys(value) : null
    })

    setTaxonomySelectedKeys(value)
  }

  const handleEnableDateChanged = (value: boolean): void => {
    dispatchStatus({ type: 'enable_range', value: value, range: rangeValue })
    setEnableDateFilter(value)
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
    status: status,
    otherItems: otherItems,
    resourceSelectedKeys: resourceSelectedKeys,
    taxonomySelectedKeys: taxonomySelectedKeys,
    dispatchStatus: dispatchStatus,
    dispatchOtherItems: dispatchOtherItems,
    handleTextChunkChange: handleTextChunkChange,
    handleEnableDateChanged: handleEnableDateChanged,
    handleSourceSelectionChange: handleSourceSelectionChange,
    handleTaxonomySelectionChange: handleTaxonomySelectionChange,
    handleItemChange: handleItemChange,
    handleRangeChange: handleRangeChange
  })

  return (
    <Flex direction="column" align="center" gap="xl">
      <ApplyFilters
        status={status}
        onApplyFilters={handleApplyFilters}
        onClear={handleClearFilters}
      />
      <TextChunkFilter
        value={chunkText}
        onChange={handleTextChunkChange}
        modified={(status.chunkModified ?? 0) > 0}
      />
      <Container w={rem(350)} mb={rem(10)}>
        <YearsRangeFilter
          enableDateFilter={enableDateFilter}
          onEnableDateChanged={handleEnableDateChanged}
          value={rangeValue}
          rangeBoundaries={rangeBoundaries}
          onValueChange={setRangeValue}
          onValueChangeEnd={handleRangeChange}
          modified={(status.rangeModified ?? 0) > 0}
        />
      </Container>

      <Accordion
        w={rem(350)}
        chevronPosition="left"
        multiple
        defaultValue={['sources-tree', 'taxonomy-tree']}
        variant="separated"
      >
        <Accordion.Item value="sources-tree">
          <Accordion.Control>
            <Indicator inline pr={10} color="orange" disabled={!status.sourceModified}>
              <Text span>Data sources</Text>
            </Indicator>
          </Accordion.Control>
          <Accordion.Panel>
            <ScrollArea.Autosize mx="auto" mah={rem(300)}>
              <DataSourceFilter
                data={resourceNodes}
                selectedKeys={resourceSelectedKeys}
                onSelectionChange={handleSourceSelectionChange}
              />
            </ScrollArea.Autosize>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="taxonomy-tree">
          <Accordion.Control>
            <Indicator inline pr={10} color="orange" disabled={!status.taxonomyModified}>
              <Text span>Taxonomies</Text>
            </Indicator>
          </Accordion.Control>
          <Accordion.Panel>
            <ScrollArea.Autosize mx="auto" mah={rem(300)}>
              <TaxonomyFilter
                data={taxonomyNodes}
                selectedKeys={taxonomySelectedKeys}
                onSelectionChange={handleTaxonomySelectionChange}
              />
            </ScrollArea.Autosize>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="other">
          <Accordion.Control>
            <Indicator inline pr={10} color="orange" disabled={!status.otherModified}>
              <Text span>Other</Text>
            </Indicator>
          </Accordion.Control>
          <Accordion.Panel>
            <OtherFilter data={otherItems} onItemChange={handleItemChange} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Flex>
  )
}

export default FiltersPanel
