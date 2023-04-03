import { TabView, TabPanel } from 'primereact/tabview'

import PostSearch from './components/PostSearch'
import SearchType from './components/SearchType'
import TimeRange from './components/TimeRange'

const TabMenuFilters = () => {
  return (
    <div className="tab-filter">
      <div className="card">
        <TabView className="tabview-header-icon">
          <TabPanel header="Refine Search" leftIcon="pi pi-fw pi-filter">
            <SearchType />
            <TimeRange />
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
