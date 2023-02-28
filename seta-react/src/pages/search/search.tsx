import { useEffect, useRef, useState } from 'react';
import './style.css';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import TabMenus from '../../components/tab-menu/tab-menu';
import DialogButton from '../../components/dialog/dialog';
import { Operators, Term, TermType } from '../../models/term.model';
import { CorpusService } from '../../services/corpus/corpus.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
import { Observable, of } from 'rxjs';
import { BreadCrumb } from 'primereact/breadcrumb';
import { AutoComplete } from 'primereact/autocomplete';
import { SuggestionsService } from '../../services/corpus/suggestions.service';
import { SimilarsService } from '../../services/corpus/similars.service';
import { OntologyListService } from '../../services/corpus/ontology-list.service';
import { Tree } from 'primereact/tree';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { ListBox } from 'primereact/listbox';

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
    const [filteredTerms, setFilteredTerms] = useState<any>(null);
    const [ontologyList, setOntologyList] = useState<any>(null);
    const [treeLeaf, setTreeLeaf] = useState<any>(null);
    const [selectedNodeKeys2, setSelectedNodeKeys2] = useState<any>(term);
    const [swithToAutocomplete, setSwithToAutocomplete] = useState(false);
    const [searchAllTerms, setSearchAllTerms] = useState(false);
    const [inputText, setInputText] = useState(``);
    const [copyQyery, setCopyQuery] = useState<Term[] | any>([]);
    const refs = useRef<any>(null);
    
    const corpusService = new CorpusService();
    const suggestionsService = new SuggestionsService();
    const similarsService = new SimilarsService();
    const ontologyListService = new OntologyListService();
    let corpusParameters$: Observable<CorpusSearchPayload>;

    const isMounted = useRef(false);
    const op = useRef<OverlayPanel>(null);
    const op1 = useRef<OverlayPanel>(null);
    let cp: CorpusSearchPayload;

    const itemsBreadCrumb = [
        {label: 'Search', url: '/seta-ui/search'},
        {label: 'Document List'}
    ];
    const home = { icon: 'pi pi-home', url: '/seta-ui' }

    useEffect(() => {
        if (isMounted) {
            op.current?.hide();
            op1.current?.hide();
        }
    }, [ selectedNodeKeys2 ]);

    useEffect(() => {
        isMounted.current = true;
        if (String(term).split(" ").length > 1) {
            let operator = ' OR ';
            let result = String(term).split(" ").join(operator);
            setCopyQuery(result);
        }
        corpusParameters$?.subscribe((corpusParameters: CorpusSearchPayload) => {
          cp = new CorpusSearchPayload({ ...corpusParameters });
        });

        setLastPayload(new CorpusSearchPayload({ ...cp, term: copyQyery, aggs: 'date_year', n_docs: 100, search_type: typeofSearch, date_range: timeRangeValue }));
        corpusService.getRefreshedToken();
    }, [term, typeofSearch, timeRangeValue, swithToAutocomplete, selectedNodeKeys2, ontologyList, suggestedTerms, copyQyery]);

    const selectAll = (checked: boolean) => {
        let arr: any = [];
        arr.push(term);
        let _selectedKeys = {};
        for (let node of treeLeaf) {
            selectNode(node, _selectedKeys, checked);
        }

        setSelectedNodeKeys2(_selectedKeys);
        if (Object.keys(_selectedKeys).length > 0) {
            Object.keys(_selectedKeys).forEach(element => {
                if (!term.includes(element)){
                    arr.push(element)
                }
            });
        }
        else {
            arr = [];
        }
        setTerm(arr);
    };

    const selectNode = (node, _selectedKeys, checked) => {
        if (checked === true) {
            _selectedKeys[node.key] = { checked: checked, partialChecked: false };
            if (node.children && node.children.length) {
                for (let child of node.children) {
                    selectNode(child, _selectedKeys, checked);
                }
            }
        }

        if (checked === false) {
            _selectedKeys = {}
        }
    };

    const createTree = (nodes) => {
        let label, key, children, node_list: any = [];
        nodes.forEach(node => {
            label = node[0];
            key = node[0];
            node.shift();
            var children_list: any = [];
            var obj: any = {};
            node.forEach((item) => {
                obj = {'label': item, 'key': item};
                children_list.push(obj);
            });
            children = children_list;
            let tree_node = {
                key,
                label,
                children
            }
            node_list.push(tree_node);
        });
        let root;
        root = {
                "root": node_list
                
        }
        setTreeLeaf(root.root);
    }

    const onSwitch = (e) => {
        setSwithToAutocomplete(e.value);
    }

    const onSearchAll = (e) => {
        selectAll(e.value);
        setSearchAllTerms(e.value);
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
    
    const searchSuggestions = () => {
        setTimeout(() => {
            setFilteredTerms(suggestedTerms);
        }, 250);
    }

    const onChangeTerm = (e) => {
        e.preventDefault();
        let lastKeyword: any = e.target.value.split(' ').pop();
        suggestionsService.retrieveSuggestions(lastKeyword).then(data => {
            if (data) {
                setSuggestedTerms(data);
            }
        });
        setFilteredTerms(suggestedTerms);
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

    const handleKeypress = (e) => {
        if (e.key === 'Enter') {
            transform(e.target.value.split(' ').pop());
        }
    };

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
                  // textInput.display.indexOf(`-`) !== -1 ? `"${textInput.display}"` : `${textInput.display}`
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
            setInputText(textInput + ` `);
          return of();
        } else {
            setInputText(``);
        }
        console.log(of(item))
        return of(item);
    }

    return (
        <>
        <BreadCrumb model={itemsBreadCrumb} home={home} />
        <div className="page">
            { showContent ? null : <div>Discover and Link Knowledge in EU Documents</div> }
            <div className="col-8">
                <div className='switchButton'>
                    <h5>Switch to related terms search</h5>
                    <InputSwitch checked={swithToAutocomplete} onChange={onSwitch} />
                </div>
                <div className="p-inputgroup">
                    <DialogButton
                      onChange={getDocumentList}
                      onChangeText={getTextValue}
                      onChangeFile={getFileName}
                      onChangeContentVisibility={toggleListVisibility}
                    />
                    { swithToAutocomplete ? 
                    <>
                        <InputText
                            type="search"
                            aria-haspopup
                            ref={refs}
                            value={term}
                            aria-controls="overlay_panel"
                            className="select-product-button"
                            placeholder="Type term and/or drag and drop here document"
                            onChange={(e) => {
                                if (term === "") {
                                    setSelectedNodeKeys2(term);
                                }
                                const lastKeyword = e.target.value.split(' ').pop();
                                ontologyListService.retrieveOntologyList(lastKeyword).then(data => {
                                    if (data) {
                                        setOntologyList(data);
                                        createTree(data);
                                    }
                                });
                                op.current?.toggle(e);
                                setTerm(e.target.value);
                            }}
                            onKeyPress={handleKeypress}
                          />
                        <OverlayPanel
                            ref={op}
                            showCloseIcon
                            id="overlay_panel"
                            style={{ width: "60%", left: "20%"}}
                            className="overlaypanel"
                        >
                            <div className='search_all'>
                                <h5>Search all related terms</h5>
                                <InputSwitch checked={searchAllTerms} onChange={onSearchAll} />
                            </div>
                            { searchAllTerms ? <div></div> :
                                <Tree
                                    className='tree-panel'
                                    value={treeLeaf}
                                    // header={search_all}
                                    disabled={searchAllTerms ? true : false}
                                    footer={`Selected terms: ${Object.keys(selectedNodeKeys2).length}`}
                                    selectionKeys={selectedNodeKeys2}
                                    onSelectionChange={(e) => {
                                        setSelectedNodeKeys2(e.value);
                                        let value: any = e.value;
                                        let arr: any = [];
                                        arr.push(term);
                                        Object.keys(value).forEach(element => {
                                            if (!term.includes(element)){
                                                arr.push(element)
                                            }
                                        });
                                        setTerm(arr);
                                    }}
                                    selectionMode="checkbox"
                                ></Tree>
                            }
                        </OverlayPanel>
                    </>
                    :
                    <>
                        <InputText
                            type="search"
                            aria-haspopup
                            value={term}
                            aria-controls="overlay_panel1"
                            className="select-product-button"
                            placeholder="Type term and/or drag and drop here document"
                            onChange={(e) => {
                                e.preventDefault();
                                let lastKeyword: any = e.target.value.split(' ').pop();
                                suggestionsService.retrieveSuggestions(lastKeyword).then(data => {
                                    if (data) {
                                        setSuggestedTerms(data);
                                    }
                                });
                                op1.current?.toggle(e);
                                setFilteredTerms(suggestedTerms);
                                setTerm(e.target.value);
                            }}
                            onKeyPress={handleKeypress}
                        />
                        {/* // <AutoComplete
                        //     suggestions={filteredTerms}
                        //     completeMethod={searchSuggestions}
                        //     type="search"
                        //     aria-haspopup
                        //     aria-controls="overlay_panel"
                        //     className="select-product-button"
                        //     value={term}
                        //     autoHighlight={true}
                        //     placeholder="Type term and/or drag and drop here document"
                        //     onChange={onChangeTerm}
                        // /> */}
                        <OverlayPanel
                            ref={op1}
                            showCloseIcon
                            id="overlay_panel1"
                            style={{ width: "55%", left: "19%", height: "240px"}}
                            className="overlaypanel1"
                        >
                            <ListBox value={term} options={suggestedTerms}
                                onChange={(e) => {
                                    transform(e.value).subscribe((response: any) =>{
                                        console.log(response)
                                        setTerm(response.value)
                                    });
                                    }
                                }
                            />
                        </OverlayPanel>
                    </>
                    }
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