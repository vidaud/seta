// import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact';
import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { Term } from '../../models/term.model';
import { CorpusService } from '../../services/corpus/corpus.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
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