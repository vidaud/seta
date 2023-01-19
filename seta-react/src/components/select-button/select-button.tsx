import React, { useState } from 'react';
import { SelectButton } from 'primereact/selectbutton';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
import { CorpusService } from '../../services/corpus/corpus.service';
import { Observable } from 'rxjs';

const SearchType = () => {
    const [searchType, setSearchType] = useState('CHUNK_SEARCH');
    const [items, setItems] = useState<any>([]);
    const corpusService = new CorpusService();
    let corpusParameters$: Observable<CorpusSearchPayload>;
    let cp: CorpusSearchPayload;

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
        const lastPayload = new CorpusSearchPayload({ ...cp, search_type: e.value, aggs: 'date_year', ndocs: 10 });
        corpusService.getDocuments(lastPayload).then(data => setItems(data));
    }
    
    return (
        <div>
            <h5>Search Type</h5>
            <SelectButton value={searchType} options={justifyOptions} onChange={onChangeSearchType} itemTemplate={justifyTemplate} optionLabel="value" />
        </div>
    );
}
export default SearchType;