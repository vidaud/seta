import { TabView, TabPanel } from 'primereact/tabview'

import DocumentList from './components/DocumentList'

import TabMenuFilters from '../TabMenuFilters'

const TabMenus = () => {
  return (
    <div className="tab">
      <div className="card">
        <TabView className="tabview-header-icon">
          <TabPanel header="Document List" leftIcon="pi pi-fw pi-list">
            <div className="page-sections">
              <div className="table-filters">
                <TabMenuFilters />
              </div>
              <div className="tab-filters">
                <DocumentList />
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
