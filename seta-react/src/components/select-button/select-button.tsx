import { useState } from 'react';
import { SelectButton } from 'primereact/selectbutton';

const SearchType = ({onSelectType}) => {
    const [searchType, setSearchType] = useState('CHUNK_SEARCH');

    const justifyOptions = [
        {icon: 'pi pi-align-left', value: 'CHUNK_SEARCH', tooltip: 'CHUNK SEARCH', label: 'CHUNK SEARCH'},
        {icon: 'pi pi-align-center', value: 'DOCUMENT_SEARCH', tooltip: 'DOCUMENT SEARCH', label: 'DOCUMENT SEARCH'},
        {icon: 'pi pi-align-justify', value: 'ALL_CHUNKS_SEARCH', tooltip: 'ALL CHUNKS SEARCH', label: 'ALL CHUNKS SEARCH'}
    ];

    const justifyTemplate = (option) => {
        return <i className={option.icon}></i>;
    }

    const onChangeSearchType = (e) => {
        setSearchType(e.value);
        onSelectType(e.value);
    }
    
    
    return (
        <div>
            <h5>Search Type</h5>
            <SelectButton value={searchType} options={justifyOptions} onChange={onChangeSearchType} itemTemplate={justifyTemplate} optionLabel="value" />
        </div>
    );
}
export default SearchType;