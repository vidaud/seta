// import React from 'react';
import { Image } from 'primereact/image';
import contact from '../../images/contact_p.jpg'
import { Splitter, SplitterPanel } from 'primereact/splitter';

import './style.css';

const Contact = () => {
    return (
        <div className='page'>
            <Splitter gutterSize={0} className='p-splitter'>
                <SplitterPanel>
                <p className='paragraph'>
                    You can also contact us via the 
                    <a href="https://webgate.ec.europa.eu/connected/community/jrc/jrc-t-digital-transformation-and-data/t4-data-governance-and-services"> JRC T.4 - data Governance and Services</a>
                </p>
                </SplitterPanel>
                <SplitterPanel>
                <Image src={contact} alt="Contact" width="600" />
                </SplitterPanel>
            </Splitter>
        </div>
        );
    }
export default Contact;