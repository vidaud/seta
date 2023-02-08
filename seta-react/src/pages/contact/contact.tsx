// import React from 'react';
import { Image } from 'primereact/image';
import contact from '../../images/contact_p.jpg'

import './style.css';

const Contact = () => {
    return (
        <div className='page'>
            <div className="row">
                <div className="col-md 6">
                <p className='paragraph'>
                    You can also contact us via the 
                    <a href="https://webgate.ec.europa.eu/connected/community/jrc/jrc-t-digital-transformation-and-data/t4-data-governance-and-services"> JRC T.4 - data Governance and Services</a>
                </p>
                </div>
                <div className="col-md 6">
                <Image src={contact} alt="Contact" width="600" />
                </div>
               
            </div>

        </div>
        );
    }
export default Contact;