// import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact';
import PostSearch from '../post-search/post-search';

const TabMenuFilters = () => {
    // const items = [
    //     {label: 'Refine Search', icon: 'pi pi-fw pi-filter'},
    //     {label: 'Post Search', icon: 'pi pi-fw pi-chart-pie'},
    // ];

    return (
        <div className="tab-filter">
            <div className="card">
                {/* <TabMenu model={items} /> */}
                <TabView className="tabview-header-icon">
                    <TabPanel header="Refine Search" leftIcon="pi pi-fw pi-filter">
                    </TabPanel>
                    <TabPanel header="Post Search" leftIcon="pi pi-fw pi-chart-pie"> 
                        <PostSearch />
                    </TabPanel>
                </TabView>
            </div>

            
        </div>
    );
}
export default TabMenuFilters;