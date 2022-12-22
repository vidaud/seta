import { useState } from 'react';
import { Dialog } from 'primereact';
import { Button } from 'primereact/button';
import './style.css';
import FileUploads from '../file-upload/file-upload';
import TextareaInput from '../textarea/textarea';

const DialogButton = () => {
    const [displayBasic, setDisplayBasic] = useState(false);

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
    }

    const onClick = (name) => {
        dialogFuncMap[`${name}`](true);
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const renderFooter = (name: any) => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
                <Button label="Search" icon="pi pi-check" onClick={() => onHide(name)} autoFocus />
            </div>
        );
    }

    return (
        <div className="dialog-demo">
                <Button icon="pi pi-cloud-upload" className="p-inputgroup-addon" aria-label="Upload" onClick={() => onClick('displayBasic')}/>
                <Dialog header="Search with Document/Text" visible={displayBasic} style={{ width: '50vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                    <FileUploads />
                    <TextareaInput />
                </Dialog>
            </div>
    )
}
export default DialogButton;