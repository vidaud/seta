import { useState } from 'react'
import { Container, Flex, Accordion, ScrollArea, rem } from '@mantine/core'

import useFilter from './useFilter'

import { buildFiltersContract } from '../../custom/map-query'
import type { AdvancedFilterProps } from '../../types/contracts'
import type { RangeValue, SelectionKeys } from '../../types/filters'
import { ViewFilterInfo, TextChunkValues, FilterStatus } from '../../types/filters'
import ApplyFilters from '../ApplyFilters'
import DataSourceFilter from '../DataSourceFilter'
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
    dispatchStatus
  } = useFilter(queryContract)

  const buildFilterInfo = (): ViewFilterInfo => {
    const fi = new ViewFilterInfo()

    fi.chunkValue = TextChunkFilter[chunkText]
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

    const newStatus = status.copy()

    newStatus.status = FilterStatus.PROCESSING
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

  return (
    <Flex direction="column" align="center" gap="md">
      <ApplyFilters status={status} onApplyFilters={handleApplyFilters} />
      <TextChunkFilter value={chunkText} onChange={handleTextChunkChange} />
      <Container w={rem(350)} mb={rem(10)}>
        <YearsRangeFilter
          enableDateFilter={enableDateFilter}
          onEnableDateChanged={handleEnableDateChanged}
          value={rangeValue}
          rangeBoundaries={rangeBoundaries}
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
        <Accordion.Item value="sources-tree">
          <Accordion.Control>Data sources</Accordion.Control>
          <Accordion.Panel>
            <ScrollArea.Autosize mx="auto" mah={rem(220)}>
              <DataSourceFilter
                data={resourceNodes}
                selectedKeys={resourceSelectedKeys}
                onSelectionChange={handleSourceSelectionChange}
              />
            </ScrollArea.Autosize>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="taxonomy-tree">
          <Accordion.Control>Taxonomies</Accordion.Control>
          <Accordion.Panel>
            <ScrollArea.Autosize mx="auto" mah={rem(220)}>
              <TaxonomyFilter
                data={taxonomyNodes}
                selectedKeys={taxonomySelectedKeys}
                onSelectionChange={handleTaxonomySelectionChange}
              />
            </ScrollArea.Autosize>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Flex>
  )
}

export default FiltersPanel
