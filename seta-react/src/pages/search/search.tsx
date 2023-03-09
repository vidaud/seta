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
import { Tree } from 'primereact/tree';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { SimilarsService } from '../../services/corpus/similars.service';
import { SelectButton } from 'primereact/selectbutton';

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
    const [swithToRelatedTerms, setSwithToRelatedTerms] = useState(false);
    const [searchAllTerms, setSearchAllTerms] = useState(false);
    const [inputText, setInputText] = useState(``);
    const [copyQyery, setCopyQuery] = useState<Term[] | any>([]);
    const [singleTerm, setSingleTerm] = useState<Term[] | any>([]);
    const [loading, setLoading] = useState(true);
    const [test1, setTest1] = useState<Term[] | any>('');
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [similarTerms, setSimilarTerms] = useState<any>(null);
    const [value, setValue] = useState<any>(null);
    const [valueList, setValueList] = useState([]);
    
    
    const corpusService = new CorpusService();
    const suggestionsService = new SuggestionsService();
    const ontologyListService = new OntologyListService();
    const similarService = new SimilarsService();

    const isMounted = useRef(false);
    const op = useRef<OverlayPanel>(null);
    let cp: CorpusSearchPayload;

    const defaultTypeOfSearch = {
        code: "AC",
        name: "Autocomplete"
    }
    const [selectedTypeSearch, setSelectedTypeSearch] = useState<any>(defaultTypeOfSearch);

    const itemsBreadCrumb = [
        {label: 'Search', url: '/seta-ui/search'},
        {label: 'Document List'}
    ];
    const home = { icon: 'pi pi-home', url: '/seta-ui' }
    const typeOfSearches = [
        { name: 'Autocomplete', code: 'AC' },
        { name: 'Related term clusters', code: 'RC' },
        { name: 'Related terms', code: 'RT' }
    ];

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
        setValueList(value);
        //update corpus api call parameters
        setLastPayload(new CorpusSearchPayload({ ...cp, term: copyQyery, aggs: 'date_year', n_docs: 100, search_type: typeofSearch, date_range: timeRangeValue }));
        corpusService.getRefreshedToken();
    }, [term, typeofSearch, timeRangeValue, swithToRelatedTerms, selectedNodeKeys2, ontologyList, suggestedTerms, copyQyery, selectedTypeSearch, similarTerms, value]);

    const toggleSelectAllNodes = (checked: boolean) => {
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

    const onSwitchToRelatedTerms = (e) => {
        setSwithToRelatedTerms(e.value);
        //switch select all ontology list items to false when both swithToRelatedTerms and searchAllTerms are true
        if (swithToRelatedTerms === true && searchAllTerms === true) {
            setSearchAllTerms(false);
            toggleSelectAllNodes(false);
            setTerm(singleTerm);
        }
    }

    const onSearchAllTreeNodes = (e) => {
        // setSelectedTypeSearch(e.value);
        toggleSelectAllNodes(e.value);
        setSearchAllTerms(e.value);
    }

    const getOntologyList = (lastKeyword) => {
        ontologyListService.retrieveOntologyList(lastKeyword).then(data => {
                if (data) {
                    setOntologyList(data);
                    createTree(data);
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
            setInputText(textInput + ` `);
          return of();
        } else {
            setInputText(``);
        }
        return of(item);
    }

    const getWordAtNthPosition = (str: string, position: number | any) => {
        const n: any = str.substring(position).match(/^[a-zA-Z0-9-_]+/);
        const p: any = str.substring(0, position).match(/[a-zA-Z0-9-_]+$/);
        // if you really only want the word if you click at start or between
        // but not at end instead use if (!n) return
        
        //let test: any =  (p || '') + (n || ''); // demo
        let selected: any = !p && !n ? '' : (p || '') + (n || '');
        // if(p) {
        //     setTest(p.index);
        // }
        let value;
        if (p) {
            value = p.index;
        }
        let obj = [selected, value];
        return obj;
      }
    
    const toggleOverlayPanel  = (event) => {
        // op.current.toggle(event)
        console.log(event)
    }
    const suggestionsTemplate = (value) => {
        let patt = new RegExp(test1.toLowerCase, "g");
        let result = value.matchAll(patt);
        for (let res of result) {
            console.log("hi");
            console.log(res);
        }
        let string = value.substr(
            0,
            value.toLowerCase().indexOf(test1.toLowerCase())
        );
        let endString = value.substr(
            value.toLowerCase().indexOf(test1.toLowerCase()) +
            test1.length
            );
        let highlightedText = value.substr(
            value.toLowerCase().indexOf(test1.toLowerCase()),
            test1.length
        );
        return (
            <div className="country-item">
                <div>
                    {string}
                    <span style={{"color": "rgb(92 150 221)" }}>
                        {highlightedText}
                    </span>
                    {endString}
                </div>
            </div>
        );
    }

    const callService = (code) => {
        if(code === 'AC') {
            suggestionsService.retrieveSuggestions(test1).then(data => {
                if (data) {
                    setSuggestedTerms(data);
                }
            });
        }
        else if (code === 'RC') {
            setTimeout(() => {
                setLoading(true);
                getOntologyList(test1);                                
            }, 1000);
        }
        else if(code === 'RT') {
            similarService.retrieveSimilars(test1).then(data => {
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
                setTest1(keyword[0]);
                suggestionsService.retrieveSuggestions(keyword[0]).then(data => {
                    if (data) {
                        setSuggestedTerms(data);
                    }
                });
                op.current?.show(e,e.target);
                setFilteredTerms(suggestedTerms);
                setTerm(e.target.value);
            }
            else if (selectedTypeSearch.code === 'RC') {
                if (term === "") {
                    setSelectedNodeKeys2(term);
                }
                setTimeout(() => {
                    let keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart);
                    setLoading(true);
                    let typed : any = e.target.value.split(' ')[0];
                    setSingleTerm(typed);
                    setTest1(keyword[0]);
                    getOntologyList(keyword[0]);                                
                }, 1000);
                op.current?.show(e,e.target);
                setTerm(e.target.value);
            }
            else if(selectedTypeSearch.code === 'RT') {
                e.preventDefault();
                let keyword = getWordAtNthPosition(e.target.value, e.target.selectionStart);
                setTest1(keyword[0]);
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
                            data-text={test1}
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
                            className="overlaypanel1"
                        >
                            <div className='overlayPanelHeader'>
                                <div className='div-size alingItems'>
                                    { test1 ? <ToggleButton checked={checked1} className="custom" aria-label={test1} onLabel={test1} offLabel={test1} tooltip={checked1 ? 'Unselect all terms' : 'Select all terms'} tooltipOptions={{position: 'top'}}
                                        onChange={
                                            (e) => {
                                                setChecked1(e.value);
                                                if (selectedTypeSearch.code === 'RC') {
                                                    onSearchAllTreeNodes(e);
                                                }
                                                console.log(selectedTypeSearch.code)
                                            }
                                        } /> 
                                    : <span></span>}
                                </div>
                                <div className='search_dropdown div-size'>
                                    {selectedTypeSearch.code !== 'AC' ? <ToggleButton checked={checked2} onChange={(e) => setChecked2(e.value)} className="custom-thumb" aria-label={test1} offIcon="pi pi-thumbs-up" onIcon="pi pi-thumbs-up-fill" onLabel='' offLabel='' tooltip='Enrich query automatically' tooltipOptions={{position: 'bottom'}}/> : ""}
                                    <Dropdown value={selectedTypeSearch} options={typeOfSearches} onChange={onChangeOption} optionLabel="name" />
                                </div>
                            </div>
                            { selectedTypeSearch.code === 'AC' ?
                                <>
                                {/* <ListBox value={term} options={suggestedTerms} itemTemplate={suggestionsTemplate}
                                    onChange={(e) => {
                                        transform(e.value).subscribe((response: any) =>{
                                            setTerm(response.value);
                                            console.log(response);
                                        });
                                        op.current?.hide();
                                        }
                                    }
                                /> */}
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
                                        // optionLabel="value" 
                                        itemTemplate={suggestionsTemplate}
                                        options={suggestedTerms} 
                                    />
                                </div>
                                </>
                                : selectedTypeSearch.code === 'RC' ? 
                                    <Tree
                                        className='tree-panel'
                                        value={treeLeaf}
                                        loading={loading}
                                        footer={`Selected terms: ${Object.keys(selectedNodeKeys2).length}`}
                                        selectionKeys={selectedNodeKeys2}
                                        onExpand={(e) => e.node.style={display: "flex", background: "aliceblue"}}
                                        onCollapse={(e) => e.node.style={display: "block", background: "white"}}
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
                                : 
                                    <ListBox value={term} options={similarTerms}
                                    onChange={(e) => {
                                        transform(e.value).subscribe((response: any) =>{
                                            setTerm(response.value);
                                            console.log(response);
                                        });
                                        op.current?.hide();
                                        }
                                    }
                                    />
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