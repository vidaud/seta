import { useEffect, useRef, useState } from 'react'
import { Container, Flex, Accordion, rem, LoadingOverlay } from '@mantine/core'

import type { Label } from '~/types/filters/label'

import DataSourceAccordionItem from './components/DataSourceAccordionItem'
import LabelsAccordionItem from './components/LabelsAccordionItem'
import OtherFilterAccordionItem from './components/OtherFilterAccordionItem'
import { FiltersAccordionItemName } from './constants'
import useClearFilter from './hooks/useClearFilter'
import useFilter from './hooks/useFilter'
import useFiltersHandlers from './hooks/useFiltersHandlers'
import * as S from './styles'

import type { AdvancedFilterProps } from '../../types/contracts'
import { FilterStatus } from '../../types/filter-info'
import type { SelectionKeys } from '../../types/filters'
import ApplyFilters from '../ApplyFilters'
import TextChunkFilter from '../TextChunkFilter'
import YearsRangeFilter from '../YearsRangeFilter'

const FiltersPanel = ({ queryContract, onApplyFilter, onStatusChange }: AdvancedFilterProps) => {
  const [resourceSelectedKeys, setResourceSelectedKeys] = useState<SelectionKeys | null>(null)
  const [taxonomySelectedKeys, setTaxonomySelectedKeys] = useState<SelectionKeys | null>(null)

  const [selectedLabels, setSelectedLabels] = useState<Label[]>([])

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

  const {
    handleTextChunkChange,
    handleRangeChange,
    handleSourceSelectionChange,
    handleTaxonomySelectionChange,
    handleSelectedLabelsChange,
    handleItemChange,
    handleApplyFilters
  } = useFiltersHandlers({
    chunkText,
    rangeValue,
    resourceSelectedKeys,
    taxonomySelectedKeys,
    selectedLabels,
    otherItems,
    filterData,
    setChunkText,
    setRangeValue,
    setResourceSelectedKeys,
    setTaxonomySelectedKeys,
    setSelectedLabels,
    dispatchStatus,
    dispatchOtherItems,
    onApplyFilter
  })

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
    handleSelectedLabelsChange,
    handleItemChange,
    handleRangeChange
  })

  useEffect(() => {
    statusChangeRef.current?.(status.status)
  }, [status])

  // Show the loading overlay while the initial query is loading
  const isLoading = !queryContract

  const sources = filterData?.current?.sources

  return (
    <Flex direction="column" align="center" gap="xl">
      <LoadingOverlay visible={isLoading} overlayBlur={2} />

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
        multiple
        defaultValue={[FiltersAccordionItemName.DATA_SOURCE]}
        variant="separated"
      >
        <DataSourceAccordionItem
          data={resourceNodes}
          sources={sources}
          selectedKeys={resourceSelectedKeys}
          onSelectionChange={handleSourceSelectionChange}
        />

        <LabelsAccordionItem
          selectedLabels={selectedLabels}
          onSelectedLabelsChange={handleSelectedLabelsChange}
        />

        {/* TODO: Re-enable this once the taxonomy aggregations are fixed */}
        {/* <TaxonomyTreeAccordionItem
          data={resourceNodes}
          taxonomies={filterData?.current?.taxonomies}
          selectedKeys={taxonomySelectedKeys}
          onSelectionChange={handleTaxonomySelectionChange}
        /> */}

        <OtherFilterAccordionItem items={otherItems} onItemChange={handleItemChange} />
      </Accordion>
    </Flex>
  )
}

export default FiltersPanel
