import { useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'

import DocumentList from '../DocumentList'
import TabMenuFilters from '../TabMenuFilters'

const TabMenus = props => {
  const [searchType, setSearchType] = useState()
  const [timeRange, setTimeRange] = useState()
  const getSearchTypes = search_type => {
    setSearchType(search_type)
  }

  props.setTypeofSearch(searchType)

  const getTimeRange = range => {
    setTimeRange(range)
  }

  props.setTimeRangeValue(timeRange)

  return (
    <div className="tab">
      <div className="card">
        <TabView className="tabview-header-icon">
          <TabPanel header="Document List" leftIcon="pi pi-fw pi-list">
            <div className="page-sections">
              <div className="table-filters">
                <TabMenuFilters
                  onSelectSearch={getSearchTypes}
                  onSelectRange={getTimeRange}
                  aggregations={props.aggregations}
                />
              </div>
              <div className="tab-filters">
                <DocumentList documents={props} />
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Concepts" leftIcon="pi pi-fw pi-sitemap" />
          <TabPanel header="Document Map" leftIcon="pi pi-fw pi-map" />
        </TabView>
      </div>
    </div>
  )
}

export default TabMenus
