// import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact';
import { useEffect, useState } from 'react';
import DocumentList from '../../components/document-list/document-list';
// import Pagination from '../../components/pagination/pagination';
import TabMenuFilters from '../../components/tab-menu-filters/tab-menu-filters';

const TabMenus = (props) => {
    const [searchType, setSearchType] = useState();

    const getSearchTypes = (search_type) => {
        setSearchType(search_type);
    };
    props.setTypeofSearch(searchType);

    return (
        <div className="tab">
            <div className="card">
                {/* <TabMenu model={items} /> */}
                <TabView className="tabview-header-icon">
                    <TabPanel header="Document List" leftIcon="pi pi-fw pi-list">
                    <div className='page-sections'>
                        <div className='table-filters'>
                            <TabMenuFilters onSelectSearch={getSearchTypes} />
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