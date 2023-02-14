import { useState } from 'react';
import { SelectButton } from 'primereact/selectbutton';
import { Tooltip } from 'primereact/tooltip';
import './style.css';

const SearchType = ({onSelectType}) => {
    const [searchType, setSearchType] = useState('CHUNK_SEARCH');
    const [searchTooltip, setSearchTooltip] = useState('Look at the first paragraph only');

    const searchOptions = [
        {name: '1', value: 'CHUNK_SEARCH', tooltip: 'Look at the first paragraph only'},
        {name: '∃!', value: 'DOCUMENT_SEARCH', tooltip: 'Find one most related paragraph'},
        {name: '∃', value: 'ALL_CHUNKS_SEARCH', tooltip: 'Find any related paragraphs'}
    ];

    // const justifyTemplate = (option) => {
    //     return <i className={option.icon}></i>;
    // }

    const onFocusOption = (e) => {
        searchOptions.forEach(option => {
            if(option.name === e.target.ariaLabel) {
                setSearchTooltip(option.tooltip);
            }
        });

    }

    const onChangeSearchType = (e) => {
        setSearchType(e.value);
        onSelectType(e.value);
    }
    
    
    return (
        <div>
            <h5>Search Type</h5>
            <Tooltip target=".select>.p-button" content={`${searchTooltip}`} position="top" event="both" className="hoverClass"/>
            <SelectButton className="select" value={searchType} options={searchOptions} onChange={onChangeSearchType} onMouseEnter={onFocusOption} optionLabel="name" />
        </div>
    );
}
export default SearchType;