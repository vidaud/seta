import { useState } from 'react'
import { Container, Flex, Accordion, ScrollArea, Indicator, rem, Text } from '@mantine/core'

import { itemsReducer } from './items-reducer'
import useFilter from './useFilter'

import { buildFiltersContract } from '../../custom/map-query'
import type { AdvancedFilterProps } from '../../types/contracts'
import type { RangeValue, SelectionKeys } from '../../types/filters'
import {
  ViewFilterInfo,
  TextChunkValues,
  FilterStatus,
  FilterStatusInfo
} from '../../types/filters'
import ApplyFilters from '../ApplyFilters'
import DataSourceFilter from '../DataSourceFilter'
import OtherFilter from '../OtherFilter/OtherFilter'
import TaxonomyFilter from '../TaxonomyFilter'
import TextChunkFilter from '../TextChunkFilter'
import YearsRangeFilter from '../YearsRangeFilter'

const FiltersPanel = ({ queryContract, onApplyFilter }: AdvancedFilterProps) => {
  const [resourceSelectedKeys, setResourceSelectedKeys] = useState<SelectionKeys | null>(null)
  const [taxonomySelectedKeys, setTaxonomySelectedKeys] = useState<SelectionKeys | null>(null)

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
  } = useFilter(queryContract)

  const buildFilterInfo = (): ViewFilterInfo => {
    const fi = new ViewFilterInfo()

    fi.chunkValue = TextChunkValues[chunkText]
    fi.rangeValueEnabled = enableDateFilter
    fi.rangeValue = enableDateFilter ? rangeValue : undefined

    if (resourceSelectedKeys) {
      fi.sourceValues = []

      for (const rKey in resourceSelectedKeys) {
        if (!resourceSelectedKeys[rKey].checked) {
          continue
        }

        fi.sourceValues.push({
          key: rKey,
          label: rKey,
          longLabel: rKey
        })
      }
    }

    return fi
  }

  const handleApplyFilters = () => {
    const contract = buildFiltersContract(
      chunkText,
      enableDateFilter ? rangeValue : undefined,
      resourceSelectedKeys,
      taxonomySelectedKeys
    )

    const newStatus = new FilterStatusInfo()

    newStatus.status = FilterStatus.PROCESSING
    newStatus.prevStatus = FilterStatus.APPLIED

    newStatus.appliedFilter = buildFilterInfo()

    dispatchStatus({ type: 'replace', value: newStatus })

    onApplyFilter(contract)
  }

  const handleTextChunkChange = (value: TextChunkValues) => {
    dispatchStatus({ type: 'chunk_changed', value: TextChunkValues[value] })

    setChunkText(value)
  }

  const handleRangeChange = (value: RangeValue) => {
    dispatchStatus({ type: 'range_changed', value: value })
  }

  const handleSourceSelectionChange = (value: SelectionKeys) => {
    dispatchStatus({
      type: 'source_changed',
      value: value ? Object.keys(value) : null
    })

    setResourceSelectedKeys(value)
  }

  const handleTaxonomySelectionChange = (value: SelectionKeys) => {
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

  return (
    <Flex direction="column" align="center" gap="md">
      <ApplyFilters status={status} onApplyFilters={handleApplyFilters} />
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
