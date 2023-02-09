import { useState } from 'react';
import { Dialog } from 'primereact';
import { Button } from 'primereact/button';
import './style.css';
import FileUploads from '../file-upload/file-upload';
import TextareaInput from '../textarea/textarea';
import { EmbeddingsService } from '../../services/corpus/embeddings.service';
import { CorpusService } from '../../services/corpus/corpus.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';

const DialogButton = ({onChange, onChangeText, onChangeFile, onChangeContentVisibility}) => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const [embeddings, setEmbeddings] = useState([]);
    const [documentList, setDocumentList] = useState([]);
    const [textareaValue, setTextareaValue] = useState("");
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [showContentList, setShowContentList] = useState(false);
    const embeddingsService = new EmbeddingsService();
    let cp: CorpusSearchPayload;
    const corpusService = new CorpusService();
    
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
    }

    const getTextUploadValue = (string, textSearch) => {
        setTextareaValue(string);
        textSearch = undefined;
        console.log(`textarea value: ${textareaValue}`);
        onChangeText(textareaValue);

        if (textareaValue !== '') {
            embeddingsService.retrieveEmbeddings('text', { "fileToUpload": textSearch, "text": textareaValue }).then(data => setEmbeddings(data.data.embeddings.vector))
        }
    };

    const getDocumentUploadValue = (file) => {
        setFileToUpload(file);
        console.log(`file: ${fileToUpload}`);
        if (file) {
            onChangeFile(file.name);
            embeddingsService.retrieveEmbeddings('file', { "fileToUpload": file, "text": "" }).then(data => {
                setEmbeddings(data.data.embeddings.vector);
            });
        }
    };

    const onClick = (name) => {
        dialogFuncMap[`${name}`](true);
    }

    const search = (name) => {
        if(embeddings.length > 0) {
            const lastPayload = new CorpusSearchPayload({ ...cp, vector: embeddings, n_docs: 100, source: ["cordis"], term: []});
            corpusService.postDocuments(lastPayload).then(data => { 
                setDocumentList(data.documents);
                setShowContentList(true);
                onChange(data.documents);
                onChangeContentVisibility(true);
            });
        }
        dialogFuncMap[`${name}`](false);
    }
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const renderFooter = (name: any) => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
                <Button label="Search" icon="pi pi-check" onClick={() => search(name)} autoFocus />
            </div>
        );
    }

    return (
        <div className="dialog-demo">
                <Button icon="pi pi-cloud-upload" className="p-inputgroup-addon" aria-label="Upload" onClick={() => onClick('displayBasic')}/>
                <Dialog header="Search with Document/Text" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                    <FileUploads onChange={getDocumentUploadValue} />
                    <TextareaInput onChange={getTextUploadValue} />
                </Dialog>
            </div>
    )
}
export default DialogButton;