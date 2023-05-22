import { useRef, useState } from 'react'
import { useTimeout, useLogger } from '@mantine/hooks'

import SidePanel from './components/SidePanel'
import { AGGREGATIONS_01 } from './samples/aggregations-01'
import { AGGREGATIONS_02 } from './samples/aggregations-02'
import type { AdvancedFiltersContract, QueryAggregationContract } from './types/contracts'

const SearchWithFilters = () => {
  const [queryContract, setQueryContract] = useState<QueryAggregationContract | null>(null)
  const advancedFilters = useRef<AdvancedFiltersContract | null>(null)

  const aggIndex = useRef(0)

  const simulateSearch = () => {
    let qc: QueryAggregationContract | null = null

    if (aggIndex.current === 0) {
      aggIndex.current = 1
      qc = AGGREGATIONS_01
    } else {
      aggIndex.current = 0
      qc = AGGREGATIONS_02
    }

    setQueryContract(qc)
  }

  const { start } = useTimeout(() => simulateSearch(), 500)

  useLogger('SearchWithFilters', [advancedFilters.current])

  const handleApplyFilter = (value: AdvancedFiltersContract) => {
    advancedFilters.current = value
    start()
  }

  return (
    <SidePanel
      queryContract={queryContract}
      onApplyFilter={handleApplyFilter}
      filtersDisabled={false}
    />
  )
}

export default SearchWithFilters
