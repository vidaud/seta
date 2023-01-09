import { useState } from 'react';
import './style.css';
import { InputText } from 'primereact';
import { Button } from 'primereact/button';
import TabMenus from '../../components/tab-menu/tab-menu';
import DialogButton from '../../components/dialog/dialog';
import axios from 'axios';

const Search = () => {
    const [showContent, setShowContent] = useState(false);
    const [term, setTerm] = useState('');
    const onClick = () => {
        setShowContent(true);
        axios({
            method: "GET",
            url:"/seta-api/api/v1/corpus",
            params:{
              aggs: 'date_year',
            }
          })
          .then((response) => {
            console.log(response);
            console.log(response.data.documents);
          }).catch((error) => {
            if (error.response) {
              console.log(error.response)
              }
          });
        console.log(term);
    }

    return (
        <div className="page">
            { showContent ? null : <div>Discover and Link Knowledge in EU Documents</div> }
            <div className="col-8">
                <div className="p-inputgroup">
                    <DialogButton />
                    <InputText type="search" placeholder="Type term and/or drag and drop here document" onChange={(e) => setTerm(e.target.value)}/>
                    <Button label="Search" onClick={onClick}/>
                </div>
            </div>
            <div>
                { showContent ? <TabMenus term={term}/> : null }
            </div>
        </div>
        );
    }
export default Search;