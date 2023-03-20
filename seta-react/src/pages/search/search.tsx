import { useEffect, useRef, useState } from 'react';
import './style.css';
import { Button } from 'primereact/button';
import TabMenus from '../../components/tab-menu/tab-menu';
import DialogButton from '../../components/dialog/dialog';
import { Operators, Term, TermType } from '../../models/term.model';
import { CorpusService } from '../../services/corpus/corpus.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
import { BreadCrumb } from 'primereact/breadcrumb';
import { SuggestionsService } from '../../services/corpus/suggestions.service';
import { OntologyListService } from '../../services/corpus/ontology-list.service';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { SimilarsService } from '../../services/corpus/similars.service';
import { SelectButton } from 'primereact/selectbutton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { defaultTypeOfSearch, itemsBreadCrumb, home, typeOfSearches, columns, getWordAtNthPosition, itsPhrase, transform, getSelectedTerms, getListOfTerms, transformOntologyList } from './constants';

const Search = () => {
    const [showContent, setShowContent] = useState(false);
    const [term, setTerm] = useState<Term[] | any>([]);
    const [listOfTerms, setListOfTerms] = useState<Term[] | any>([]);
    const [items, setItems] = useState<any>([]);
    const [aggregations, setAggregations] = useState<any>([]);
    const [documentList, setDocumentList] = useState([]);
    const [typeofSearch, setTypeofSearch] = useState();
    const [timeRangeValue, setTimeRangeValue] = useState();
    const [lastPayload, setLastPayload] = useState<any>();
    const [suggestedTerms, setSuggestedTerms] = useState<any>(null);
    const [ontologyList, setOntologyList] = useState<any>(null);
    const [selectedNodeKeys2, setSelectedNodeKeys2] = useState<any>(term);
    const [inputText, setInputText] = useState<Term[] | any>('');
    const [copyQyery, setCopyQuery] = useState<Term[] | any>([]);
    const [loading, setLoading] = useState(true);
    const [selectAll, setSelectAll] = useState(false);
    const [enrichQuery, setEnrichQuery] = useState(false);
    const [similarTerms, setSimilarTerms] = useState<any>(null);
    const [ontologyValue, setOntologyValue] = useState<any>(null);
    const [suggestionsValue, setSuggestionsValue] = useState<any>(null);
    const [similarValues, setSimilarValues] = useState<any>(null);
    const [selectedRelatedTermsCl, setSelectedRelatedTermsCl] = useState(null);
    const [selectedTypeSearch, setSelectedTypeSearch] = useState<any>(defaultTypeOfSearch);
    const [selectedColumns, setSelectedColumns] = useState(columns);
    const isMounted = useRef(false);
    const op = useRef<OverlayPanel>(null);
    let cp: CorpusSearchPayload;
    
    const corpusService = new CorpusService();
    const suggestionsService = new SuggestionsService();
    const ontologyListService = new OntologyListService();
    const similarService = new SimilarsService();

    useEffect(() => {
        if (isMounted) {
            op.current?.hide();
        }
    }, [ selectedNodeKeys2 ]);

    useEffect(() => {
        isMounted.current = true;
        if (String(term) !== '') {
            setListOfTerms(getListOfTerms(String(term)));
            setCopyQuery(getSelectedTerms(listOfTerms));
        }
        let result = String(term).split(',').join(' ');
        setTerm(result);
        //update corpus api call parameters
        setLastPayload(new CorpusSearchPayload({ ...cp, term: copyQyery, aggs: 'date_year', n_docs: 100, search_type: typeofSearch, date_range: timeRangeValue }));
        corpusService.getRefreshedToken();
    }, [term, typeofSearch, timeRangeValue, selectedNodeKeys2, ontologyList, suggestedTerms, copyQyery, listOfTerms, selectedTypeSearch, similarTerms, suggestionsValue, similarValues, ontologyValue]);

    const selectAllTerms = (selectedNodes) => {
        let listOfTerms: any = [];
        listOfTerms.push(inputText);
        if (selectedNodes.length > 0) {
            selectedNodes.forEach(item => {
                listOfTerms.push(item);
            });
            let uniqueTerms = listOfTerms.filter((subject, index) => {
                return listOfTerms.indexOf(subject) === index;
            });
            setSimilarValues(uniqueTerms);
            transformPhrases(uniqueTerms);
        }
        if (selectedNodes.length === 0) {
            setSimilarValues(listOfTerms);
            setTerm(listOfTerms);
        }
        toggleSelectAll(selectedNodes, similarTerms);
    }

    const selectNode = (selectedNodes) => {
        setSelectedRelatedTermsCl(selectedNodes);
        let listOfClusterTerms: any = [];
        listOfClusterTerms.push(inputText);
        if (selectedNodes.length > 0) {
            selectedNodes.forEach(item => {
                if (item.node) {
                    listOfClusterTerms.push(...item.node);
                }
                else {
                    listOfClusterTerms.push(item);
                }
            });
            let uniqueValues = listOfClusterTerms.filter((subject, index) => {
                return listOfClusterTerms.indexOf(subject) === index;
            });
            setOntologyValue(uniqueValues);
            transformPhrases(uniqueValues);
        }
        if (selectedNodes.length === 0) {
            setOntologyValue(listOfClusterTerms);
            setTerm(listOfClusterTerms);
        }
        toggleSelectAll(selectedNodes, ontologyList);
    }

    const transformPhrases = (terms) => {
        let listOfValues: any = [];
        terms.forEach(item => {
            itsPhrase(item) ? listOfValues.push(`"${item}"`) : listOfValues.push(item);
        });
        let copyTerm = String(listOfValues).split(',').join(' OR ');
        setCopyQuery(copyTerm)
        setTerm(listOfValues);
    }
    
    const toggleSelectAll = (items, allList) => {
        if (items.length === allList.length) {
            setSelectAll(true)
        } else {
            setSelectAll(false)
        }
    }
    
    const getOntologyList = (lastKeyword) => {
        ontologyListService.retrieveOntologyList(lastKeyword).then(data => {
            if (data) {
                setOntologyList(transformOntologyList(data));
            }
            setLoading(false);
        });
    }

    const onSearch = () => {
        if (term.length >= 2) {
            corpusService.getRefreshedToken();
            corpusService.getDocuments(lastPayload).then(data => {
                if (data) {
                    setItems(data.documents);
                    setAggregations(data.aggregations);
                }
            });
            setShowContent(true);
        }
        else {
            setShowContent(false); 
        }
    }
    
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

    const onChangeOption = (e: { value: any}) => {
        setSelectedTypeSearch(e.value);
        callService(e.value.code);
    }

    const toggleEnrichQuery = (value) => {
        // ex: "(bin) AND (regulation OR guideline) AND (standard)"
        //send request to ontologyList for each keyword
        //send request to corpus with the ontology list of all keywords
        setEnrichQuery(value);
        if (value === true) {
            if (selectedTypeSearch.code === 'RT') {
                //selectAllTerms(similarTerms);
            }
            if (selectedTypeSearch.code === 'RC') {
                // selectNode(ontologyList);
            }
        } else if (value === false) {
            if (selectedTypeSearch.code === 'RT') {
                // selectAllTerms([]);
            }
            if (selectedTypeSearch.code === 'RC') {
                // selectNode([]);
            }
        }
    }
    
    const toggleOverlayPanel  = (event) => {
        console.log(event)
    }
    
    const suggestionsTemplate = (value) => {
        let string = value.substr(
            0,
            value.toLowerCase().indexOf(inputText.toLowerCase())
        );
        let endString = value.substr(
            value.toLowerCase().indexOf(inputText.toLowerCase()) +
            inputText.length
        );
        let highlightedText = value.substr(
            value.toLowerCase().indexOf(inputText.toLowerCase()),
            inputText.length
        );
        return (
            <div className="country-item">
                <div>
                    {string}
                    <span className='highlight-text'>
                        {highlightedText}
                    </span>
                    {endString}
                </div>
            </div>
        );
    }

    const callService = (code) => {
        if(code === 'AC') {
            suggestionsService.retrieveSuggestions(inputText).then(data => {
                if (data) {
                    setSuggestedTerms(data);
                }
            });
        }
        else if (code === 'RC') {
            setTimeout(() => {
                setLoading(true);
                getOntologyList(inputText);                                
            }, 250);
        }
        else if(code === 'RT') {
            similarService.retrieveSimilars(inputText).then(data => {
                if (data) {
                    if (data.length > 0) {
                        if (data && data.length > 0) {
                            let list: any = [];
                            data.forEach(element => {
                                list.push(element.similar_word);
                            });
                            setSimilarTerms(list);
                        }
                    }
                }
            });
        }
    }

    const onUpdateSelectedTerm = (e) => {
        if(e.target.value !== '') {
            if(selectedTypeSearch.code === 'AC') {
                e.preventDefault();
                let keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart);
                setInputText(keyword[0]);
                suggestionsService.retrieveSuggestions(keyword[0]).then(data => {
                    if (data) {
                        setSuggestedTerms(data);
                    }
                });
                op.current?.show(e,e.target);
                setTerm(e.target.value);
            }
            else if (selectedTypeSearch.code === 'RC') {
                if (term === "") {
                    setSelectedNodeKeys2(term);
                }
                setTimeout(() => {
                    let keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart);
                    setLoading(true);

                    setInputText(keyword[0]);
                    getOntologyList(keyword[0]);                                
                }, 250);
                op.current?.show(e,e.target);
                setTerm(e.target.value);
            }
            else if(selectedTypeSearch.code === 'RT') {
                e.preventDefault();
                let keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart);
                setInputText(keyword[0]);
                similarService.retrieveSimilars(keyword[0]).then(data => {
                    if (data) {
                        if (data.length > 0) {
                            if (data && data.length > 0) {
                                let list: any = [];
                                data.forEach(element => {
                                    list.push(element.similar_word);
                                });
                                setSimilarTerms(list);
                            }
                        }
                    }
                });
                op.current?.show(e,e.target);
                setTerm(e.target.value);
            }
        }
    }

    const activityBodyTemplate = (rowData) => {
        return (
            <SelectButton value={ontologyValue} className="suggestions-list"
            onChange={
                (e) => {
                    selectNode(e.value);
                }
            }  
            options={rowData.node}
            multiple={true}
            />
        )
    }

    const columnComponents = selectedColumns.map(col=> {
            return <Column showFilterMatchModes={false} body={activityBodyTemplate}/>
    });

    return (
        <>
        <BreadCrumb model={itemsBreadCrumb} home={home} />
        <div className="page">
            { showContent ? null : <div>Discover and Link Knowledge in EU Documents</div> }
            <div className="col-8">
                <div className="p-inputgroup">
                    <DialogButton
                      onChange={getDocumentList}
                      onChangeText={getTextValue}
                      onChangeFile={getFileName}
                      onChangeContentVisibility={toggleListVisibility}
                    />
                        <InputText
                            type="search"
                            aria-haspopup
                            value={term}
                            data-text={inputText}
                            aria-controls="overlay_panel1"
                            className="select-product-button"
                            placeholder="Type term and/or drag and drop here document"
                            onChange={(e) => {
                                onUpdateSelectedTerm(e);
                            }}
                            onClick={(e) => {
                                onUpdateSelectedTerm(e);
                            }}
                        />
                        <OverlayPanel
                            ref={op}
                            showCloseIcon
                            id="overlay_panel1"
                            style={{ width: "55%", left: "19%"}}
                            className="overlay_panel"
                        >
                            <div className='overlayPanelHeader'>
                                <div className='div-size alingItems'>
                                    { inputText ? <ToggleButton checked={selectAll} disabled={(selectedTypeSearch.code === 'AC' ? true : false || enrichQuery === true)} className="custom" aria-label={inputText} onLabel={inputText} offLabel={inputText} tooltip={selectAll ? 'Unselect all terms' : 'Select all terms'} tooltipOptions={{position: 'top'}}
                                        onChange={
                                            (e) => {
                                                setSelectAll(e.value);
                                                if (selectedTypeSearch.code === 'RC') {
                                                    if (e.value) {
                                                        selectNode(ontologyList);
                                                    } else if (!e.value) {
                                                        selectNode([]);
                                                    }
                                                }
                                                if (selectedTypeSearch.code === 'RT') {
                                                    if (e.value) {
                                                        selectAllTerms(similarTerms);
                                                    } else if (!e.value) {
                                                        selectAllTerms([]);
                                                    }
                                                }
                                            }
                                        } /> 
                                    : <span></span>}
                                </div>
                                <div className='search_dropdown div-size'>
                                    {selectedTypeSearch.code !== 'AC' ? <ToggleButton className="custom-thumb" aria-label={inputText} offIcon="pi pi-thumbs-up" onIcon="pi pi-thumbs-up-fill" onLabel='' offLabel='' tooltip='Enrich query automatically' tooltipOptions={{position: 'bottom'}}
                                        checked={enrichQuery} onChange={
                                            (e) => {
                                                    toggleEnrichQuery(e.value);
                                                }
                                            }
                                        /> : ""}
                                    <Dropdown value={selectedTypeSearch} options={typeOfSearches} onChange={onChangeOption} optionLabel="name" />
                                </div>
                            </div>
                            { selectedTypeSearch.code === 'AC' ?
                                <>
                                    <div className="card flex justify-content-center">
                                        <SelectButton value={suggestionsValue} className="suggestions-list"
                                            onChange={
                                                (e) => {
                                                    setSuggestionsValue(e.value);
                                                    // Check for white space
                                                    if (itsPhrase(e.value)) {
                                                        setTerm(`"${e.value}"`);
                                                    } else {
                                                        setTerm(e.value);
                                                    } 
                                                    op.current?.hide();
                                                }
                                            }  
                                            itemTemplate={suggestionsTemplate}
                                            options={suggestedTerms} 
                                        />
                                    </div>
                                </>
                                : (selectedTypeSearch.code === 'RC' && enrichQuery === false) ? 
                                    <>
                                        <DataTable loading={loading} value={ontologyList} showSelectAll={false} className="dataTable-list" selection={selectedRelatedTermsCl} onSelectionChange={
                                                (e) => selectNode(e.value)
                                            } 
                                            dataKey='id' 
                                            responsiveLayout="scroll"
                                            >
                                            <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>
                                            {columnComponents}
                                        </DataTable>
                                    </>
                                : (selectedTypeSearch.code === 'RT' && enrichQuery === false) ? 
                                    <>
                                        <div className="card flex justify-content-center similars">
                                        <SelectButton value={similarValues} className="suggestions-list"
                                            onChange={
                                                (e) => {
                                                    selectAllTerms(e.value)
                                                }
                                            }  
                                            options={similarTerms}
                                            multiple={true}
                                        />
                                    </div>
                                    </>
                                : <div></div>
                            }
                        </OverlayPanel>
                    <Button icon="pi pi-ellipsis-v" className='ellipsis-v' onClick={toggleOverlayPanel}></Button>
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
        </>
    );
    }
export default Search;