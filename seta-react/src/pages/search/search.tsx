import { useState } from 'react';
import './style.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import TabMenus from '../../components/tab-menu/tab-menu';
import DialogButton from '../../components/dialog/dialog';
import axios from 'axios';

const Search = () => {
    const [showContent, setShowContent] = useState(false);
    const onClick = () => {
        setShowContent(true);
        axios({
            method: "POST",
            url:"/seta-ui/corpus/",
          })
          .then((response) => {
            console.log(response)
          }).catch((error) => {
            if (error.response) {
              console.log(error.response)
              }
          })
    }
    return (
        <div className="page">
            { showContent ? null : <div>Discover and Link Knowledge in EU Documents</div> }
            <div className="col-8">
                <div className="p-inputgroup">
                    <DialogButton />
                    <InputText placeholder="Type term and/or drag and drop here document"/>
                    <Button label="Search" onClick={onClick}/>
                </div>
            </div>
            <div>
                { showContent ? <TabMenus /> : null }
            </div>
        </div>
        );
    }
export default Search;