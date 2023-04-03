import { useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'

import PostSearch from '../PostSearch'
import SearchType from '../SearchType'
import TimeRange from '../TimeRange'

const TabMenuFilters = ({ onSelectSearch, onSelectRange, aggregations }) => {
  const [searchType, setSearchType] = useState()
  const [timeRange, setTimeRange] = useState()

  const getSearchTypeValue = search_type => {
    setSearchType(search_type)
    onSelectSearch(search_type)
  }

  const getTimeRangeValue = range => {
    setTimeRange(range)
    onSelectRange(range)
  }

  return (
    <div className="tab-filter">
      <div className="card">
        <TabView className="tabview-header-icon">
          <TabPanel header="Refine Search" leftIcon="pi pi-fw pi-filter">
            <SearchType onSelectType={getSearchTypeValue} />
            <TimeRange onTimeRange={getTimeRangeValue} list={aggregations} />
          </TabPanel>
          <TabPanel header="Post Search" leftIcon="pi pi-fw pi-chart-pie">
            <PostSearch />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

export default TabMenuFilters
