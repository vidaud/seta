import { TabView, TabPanel } from 'primereact';
import { useState } from 'react';
import PostSearch from '../post-search/post-search';
import SearchType from '../select-button/select-button';
import TimeRange from '../time-range/time-range';

const TabMenuFilters = ({onSelectSearch, onSelectRange, aggregations}) => {
    const [searchType, setSearchType] = useState();
    const [timeRange, setTimeRange] = useState();

    const getSearchTypeValue = (search_type) => {
        setSearchType(search_type);
        onSelectSearch(search_type);
    };

    const getTimeRangeValue = (range) => {
        setTimeRange(range);
        onSelectRange(range);
    };

    return (
        <div className="tab-filter">
            <div className="card">
                {/* <TabMenu model={items} /> */}
                <TabView className="tabview-header-icon">
                    <TabPanel header="Refine Search" leftIcon="pi pi-fw pi-filter">
                        <SearchType onSelectType={getSearchTypeValue}/>
                        <TimeRange onTimeRange={getTimeRangeValue} list={aggregations}/>
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