import { useEffect, useRef, useState } from 'react';
import './style.css';
import { Button } from 'primereact/button';
import TabMenus from '../../components/tab-menu/tab-menu';
import DialogButton from '../../components/dialog/dialog';
import { Operators, Term, TermType } from '../../models/term.model';
import { CorpusService } from '../../services/corpus/corpus.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
import { Observable, of } from 'rxjs';
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
import { defaultTypeOfSearch, itemsBreadCrumb, home, typeOfSearches, columns, getWordAtNthPosition } from './constants';

const Search = () => {
    const [showContent, setShowContent] = useState(false);
    const [term, setTerm] = useState<Term[] | any>([]);
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
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [similarTerms, setSimilarTerms] = useState<any>(null);
    const [value, setValue] = useState<any>(null);
    const [value1, setValue1] = useState<any>(null);
    const [selectedProducts7, setSelectedProducts7] = useState(null);
    const [selectedTypeSearch, setSelectedTypeSearch] = useState<any>(defaultTypeOfSearch);
    
    
    const corpusService = new CorpusService();
    const suggestionsService = new SuggestionsService();
    const ontologyListService = new OntologyListService();
    const similarService = new SimilarsService();

    const isMounted = useRef(false);
    const op = useRef<OverlayPanel>(null);
    let cp: CorpusSearchPayload;

    useEffect(() => {
        if (isMounted) {
            op.current?.hide();
        }
    }, [ selectedNodeKeys2 ]);

    useEffect(() => {
        isMounted.current = true;
        // transform query if contains " " or ',' between keywords
        if (String(term).split(" ").length > 1) {
            let operator = ' OR ';
            let result = String(term).split(" ").join(operator);
            setCopyQuery(result);
        }
        else if (String(term).split(',').length > 1) {
            let operator = ' OR ';
            let result = String(term).split(',').join(operator);
            let query = String(term).split(',').join(' ');
            setCopyQuery(result);
            setTerm(query);
        }
        else {
            setCopyQuery(term);
        }
        if (String(term) !== '') {
            transform(String(term));
        }
        //update corpus api call parameters
        setLastPayload(new CorpusSearchPayload({ ...cp, term: copyQyery, aggs: 'date_year', n_docs: 100, search_type: typeofSearch, date_range: timeRangeValue }));
        corpusService.getRefreshedToken();
    }, [term, typeofSearch, timeRangeValue, selectedNodeKeys2, ontologyList, suggestedTerms, copyQyery, selectedTypeSearch, similarTerms, value, value1]);

    const toggleSelectAllNodes = (checked: boolean) => {
    }


    const transformList = (nodes: any) => {
        let list: any = [];
        nodes.forEach((item) => {
            let element = {
                id: item[0],
                leaf: item
            }
            list.push(element);
        });
        setOntologyList(list);
    }

    const selectNode = (event) => {
        //event.value = array of all leafs selected
        //ontologyList = array of all leafs
        //select all options:  event.value = ontologyList
        setSelectedProducts7(event.value)
    }
    // const toggleSelectAllNodes = (checked: boolean) => {
    //     let arr: any = [];
    //     arr.push(term);
    //     let _selectedKeys = {};
    //     for (let node of treeLeaf) {
    //         selectNode(node, _selectedKeys, checked);
    //     }

    //     setSelectedNodeKeys2(_selectedKeys);
    //     if (Object.keys(_selectedKeys).length > 0) {
    //         Object.keys(_selectedKeys).forEach(element => {
    //             if (!term.includes(element)){
    //                 arr.push(element)
    //             }
    //         });
    //     }
    //     else {
    //         arr = [];
    //     }
    //     setTerm(arr);
    // };

    // const selectNode = (node, _selectedKeys, checked) => {
    //     if (checked === true) {
    //         _selectedKeys[node.key] = { checked: checked, partialChecked: false };
    //         if (node.children && node.children.length) {
    //             for (let child of node.children) {
    //                 selectNode(child, _selectedKeys, checked);
    //             }
    //         }
    //     }

    //     if (checked === false) {
    //         _selectedKeys = {}
    //     }
    // };

    // const onSearchAllTreeNodes = (e) => {
    //     toggleSelectAllNodes(e.value);
    // }

    const getOntologyList = (lastKeyword) => {
        ontologyListService.retrieveOntologyList(lastKeyword).then(data => {
                if (data) {
                    transformList(data);
                    // setOntologyList(data);
                    // createTree(data);
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

    const transform = (textInput: string | { display: string; value: string } | any): Observable<object> => {
        let item: any = null;
        // is it a string?
        if (typeof textInput === `string`) {
          // is it an operator?
          if (textInput === `AND`) {
            item = new Term({
              display: `${textInput}`,
              termType: TermType.OPERATOR,
              value: `${textInput}`,
              isOperator: true,
              operator: Operators.properties[Operators.AND],
            });
          } else {
            /*Check if there is a pair of quotes*/
            const areQuotesPresent = textInput.match('"') !== null ? true : false;
            // are quotes present?
            if (areQuotesPresent) {
              const startQuote = textInput.indexOf('"');
              const finalQuote = textInput.indexOf('"', textInput.length - 1);
              if (startQuote === 0) {
                if (textInput.length >= 3 && finalQuote === textInput.length - 1) {
                  item = new Term({
                    display: `${textInput}`,
                    termType: TermType.VERTEX,
                    value: textInput.replace(/^"|"$/g, ''),
                    isOperator: false,
                  });
                  setCopyQuery(item.display);
                }
              }
            } else {
                item = new Term({
                    display: textInput.indexOf(`-`) !== -1 ? `"${textInput}"` : `${textInput}`,
                    termType: TermType.VERTEX,
                    value: textInput.replace(/^"|"$/g, ''),
                    isOperator: false,
                });
            }
          }
        } else {
          // is it an operator?
          if (textInput.display === `AND`) {
            item = new Term({
              display: `${textInput.display}`,
              termType: TermType.OPERATOR,
              value: textInput.value.replace(/^"|"$/g, ''),
              isOperator: true,
              operator: Operators.properties[Operators.AND],
            });
          } else {
            item = new Term({
              display: textInput.display.indexOf(` `) !== -1 ?
                (textInput.display.match("\"") !== null ? true : false)
                  ?
                  `${textInput.display}`
                  :
                  `"${textInput.display}"`
                :
                textInput.display.indexOf(`-`) !== -1 ? `"${textInput.display}"` : `${textInput.display}`
              ,
              termType: TermType.VERTEX,
              value: textInput.value.replace(/^"|"$/g, ''), isOperator: false
            });
          }
        }
    
        if (item === null) {
            textInput = textInput + ` `;
            return of();
        } else {
            textInput = ` `;
        }
        return of(item);
    }
    
    const toggleOverlayPanel  = (event) => {
        console.log(event)
    }
    
    const suggestionsTemplate = (value) => {
        let patt = new RegExp(inputText.toLowerCase, "g");
        let result = value.matchAll(patt);
        for (let res of result) {
            console.log("hi");
            console.log(res);
        }
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

    const [selectedColumns, setSelectedColumns] = useState(columns);

    const activityBodyTemplate = (rowData) => {
        console.log(rowData)
        return (
            <SelectButton value={value} className="suggestions-list"
            onChange={
                (e) => {
                    console.log(e.value)
                    setValue(e.value);
                    setTerm(e.value);
                }
            }  
            options={rowData.leaf}
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
                                    { inputText ? <ToggleButton checked={checked1} className="custom" aria-label={inputText} onLabel={inputText} offLabel={inputText} tooltip={checked1 ? 'Unselect all terms' : 'Select all terms'} tooltipOptions={{position: 'top'}}
                                        onChange={
                                            (e) => {
                                                setChecked1(e.value);
                                                if (selectedTypeSearch.code === 'RC') {
                                                    // onSearchAllTreeNodes(e);
                                                }
                                                console.log(selectedTypeSearch.code)
                                            }
                                        } /> 
                                    : <span></span>}
                                </div>
                                <div className='search_dropdown div-size'>
                                    {selectedTypeSearch.code !== 'AC' ? <ToggleButton checked={checked2} onChange={(e) => setChecked2(e.value)} className="custom-thumb" aria-label={inputText} offIcon="pi pi-thumbs-up" onIcon="pi pi-thumbs-up-fill" onLabel='' offLabel='' tooltip='Enrich query automatically' tooltipOptions={{position: 'bottom'}}/> : ""}
                                    <Dropdown value={selectedTypeSearch} options={typeOfSearches} onChange={onChangeOption} optionLabel="name" />
                                </div>
                            </div>
                            { selectedTypeSearch.code === 'AC' ?
                                <>
                                    <div className="card flex justify-content-center">
                                        <SelectButton value={value} className="suggestions-list"
                                            onChange={
                                                (e) => {
                                                    console.log(e.value)
                                                    setValue(e.value);
                                                    setTerm(e.value);
                                                    op.current?.hide();
                                                }
                                            }  
                                            itemTemplate={suggestionsTemplate}
                                            options={suggestedTerms} 
                                        />
                                    </div>
                                </>
                                : selectedTypeSearch.code === 'RC' ? 
                                    <>
                                        <DataTable loading={loading} value={ontologyList} className="dataTable-list" selection={selectedProducts7} onSelectionChange={
                                                (e) => selectNode(e)
                                            } 
                                            dataKey='id' 
                                            responsiveLayout="scroll"
                                            >
                                            <Column selectionMode="multiple" headerStyle={{width: '3em'}}></Column>
                                            {columnComponents}
                                        </DataTable>
                                    </>
                                : 
                                    <>
                                        <div className="card flex justify-content-center similars">
                                        <SelectButton value={value1} className="suggestions-list"
                                            onChange={
                                                (e) => {
                                                    console.log(e.value)
                                                    setValue1(e.value);
                                                    setTerm(e.value);
                                                }
                                            }  
                                            options={similarTerms}
                                            multiple={true}
                                        />
                                    </div>
                                    </>
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