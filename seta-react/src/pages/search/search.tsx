import { useState } from 'react';
import './style.css';
import { InputText } from 'primereact';
import { Button } from 'primereact/button';
import TabMenus from '../../components/tab-menu/tab-menu';
import DialogButton from '../../components/dialog/dialog';
import { Term } from '../../models/term.model';

const Search = () => {
    const [showContent, setShowContent] = useState(false);
    const [term, setTerm] = useState<Term[]>([]);
    const [documentList, setDocumentList] = useState([]);

    const onClick = () => {
        if (term.length > 0) {
            setShowContent(true);
        }
    }

    const onChangeTerm = (e) => {
      setTerm(e.target.value);
    };

    const getDocumentList = (list) => {
        setDocumentList(documentList)
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
                    <Button label="Search" onClick={onClick}/>
                </div>
            </div>
            <div>
                { showContent ? <TabMenus term={term} list={documentList}/> : null }
            </div>
        </div>
        );
    }
export default Search;