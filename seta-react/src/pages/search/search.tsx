import { useEffect, useState } from 'react';
import './style.css';
import { InputText } from 'primereact';
import { Button } from 'primereact/button';
import TabMenus from '../../components/tab-menu/tab-menu';
import DialogButton from '../../components/dialog/dialog';
import { Term } from '../../models/term.model';
import { CorpusService } from '../../services/corpus/corpus.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
import { Observable } from 'rxjs';

const Search = () => {
    const [showContent, setShowContent] = useState(false);
    const [term, setTerm] = useState<Term[]>([]);
    const [items, setItems] = useState<any>([]);
    const [aggregations, setAggregations] = useState<any>([]);
    const [documentList, setDocumentList] = useState([]);
    const [typeofSearch, setTypeofSearch] = useState();
    const [timeRangeValue, setTimeRangeValue] = useState();
    const corpusService = new CorpusService();
    let corpusParameters$: Observable<CorpusSearchPayload>;
    let cp: CorpusSearchPayload;

    useEffect(() => {
        corpusParameters$?.subscribe((corpusParameters: CorpusSearchPayload) => {
          cp = new CorpusSearchPayload({ ...corpusParameters });
        });
          const lastPayload = new CorpusSearchPayload({ ...cp, term: term, aggs: 'date_year', n_docs: 100, search_type: typeofSearch, date_range: timeRangeValue });
          corpusService.getDocuments(lastPayload).then(data => {
            if (data) {
                setItems(data.documents);
                setAggregations(data.aggregations);
            }
          });
    }, [term, typeofSearch, timeRangeValue]);

    const onSearch = () => {
        if (term.length > 0) {
            setShowContent(true);
        }
    }

    const onChangeTerm = (e) => {
      setTerm(e.target.value);
    };

    const getDocumentList = (list) => {
        setDocumentList(items)
    }

    const getTextValue = (text) => {
        if (text !== '') {
            setTerm(text);
        }
    }

    const getFileName = (filename) => {
        if (filename !== '') {
            setTerm(filename);
        }
    }

    const toggleListVisibility = (show) => {
        if (show) {
            setShowContent(true);
        }
    }
    
    return (
        <div className="page">
            { showContent ? null : <div>Discover and Link Knowledge in EU Documents</div> }
            <div className="col-8">
                <div className="p-inputgroup">
                    <DialogButton onChange={getDocumentList} onChangeText={getTextValue} onChangeFile={getFileName} onChangeContentVisibility={toggleListVisibility}/>
                    <InputText type="search" value={term} placeholder="Type term and/or drag and drop here document" onChange={onChangeTerm}/>
                    <Button label="Search" onClick={onSearch}/>
                </div>
            </div>
            <div>
                { showContent ? 
                    <TabMenus
                        data={items}
                        term={term}
                        aggregations={aggregations}
                        typeofSearch={typeofSearch}
                        setTypeofSearch={setTypeofSearch}
                        timeRangeValue={timeRangeValue}
                        setTimeRangeValue={setTimeRangeValue}
                    /> : null }
            </div>
        </div>
        );
    }
export default Search;