import { TabView, TabPanel } from 'primereact';
import { useState } from 'react';
import DocumentList from '../../components/document-list/document-list';
import TabMenuFilters from '../../components/tab-menu-filters/tab-menu-filters';

const TabMenus = (props) => {
    const [searchType, setSearchType] = useState();
    const [timeRange, setTimeRange] = useState();
    const itemsHeader = [
        {label: 'Document List'},
        {label: 'Concepts'},
        {label: 'Document Map'}
    ];
    const getSearchTypes = (search_type) => {
        setSearchType(search_type);
    };
    props.setTypeofSearch(searchType);

    const getTimeRange = (range) => {
        setTimeRange(range);
    };
    props.setTimeRangeValue(timeRange);

    return (
        <div className="tab">
            <div className="card">
                {/* <TabMenu model={items} /> */}
                <TabView className="tabview-header-icon">
                    <TabPanel header="Document List" leftIcon="pi pi-fw pi-list">
                    <div className='page-sections'>
                        <div className='table-filters'>
                            <TabMenuFilters onSelectSearch={getSearchTypes} onSelectRange={getTimeRange} aggregations={props.aggregations}/>
                        </div>
                        <div className='tab-filters'>
                            <DocumentList documents={props} />
                        </div>
                    </div>
                    </TabPanel>
                    <TabPanel header="Concepts" leftIcon="pi pi-fw pi-sitemap">
                        
                    </TabPanel>
                    <TabPanel header="Document Map" leftIcon="pi pi-fw pi-map">
                        
                    </TabPanel>
                </TabView>
            </div>

            
        </div>
    );
}
export default TabMenus;