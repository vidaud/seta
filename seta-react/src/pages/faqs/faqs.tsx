// import React from 'react';
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
// import "primeflex/primeflex.css";

import { Accordion, AccordionTab } from 'primereact/accordion';
import './style.css';

const Faqs = () => {
    return (
        <div className='page'>
            <div className='container'>
                <div className="accordion-demo">
                    <h1 className="headerH" >FAQs</h1>
                    <Accordion activeIndex={0}>
                        <AccordionTab className='p-accordion-header' header="What are the data sources used in SeTA?">
                            <p className="m-0">
                                The main data sources are CORDIS, EUR-Lex, PUBSY, The European Parliament.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="What I expect to see in the 'Concepts' section?">
                            <p className="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="Can I modify the generated 'Document Map'?">
                            <p className="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="If I log out from the session, do I loose the 'Post Search'?">
                            <p className="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="What does the filter 'In Forced'?">
                            <p className="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="Can I download the results as a list?">
                            <p className="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="What are SeTA communities?">
                            <p className="m-0">
                                The SeTA community is an organised of people with the interests or aims to share the interest of pubblications.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="How can I join a community?">
                            <p className="m-0">
                                It is very simple, you just need to register; in our page you will find the link to do so.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="What access I have once I became a member?">
                            <p className="m-0">
                                You will have access for the community group you will join.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="Do I need to register for every single community I want to join?">
                            <p className="m-0">
                                Yes, every community group has a closed access, so it will be necessary to register for every community.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="Do I have access to all the existing communities?">
                            <p className="m-0">
                                No, every community group has a closed access, so it will be necessary to register for every community.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="Is there a newsletter or something similar to have updates on the communities?">
                            <p className="m-0">
                                No, for now there is no newsletter or any type of publications.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="Can I be inform automatically about the community updates?">
                            <p className="m-0">
                                No, for now there is no service to inform about the updates.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="Where is my personal data stored?">
                            <p className="m-0">
                                The data is stored in our database.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="Is there a community manager for every community?">
                            <p className="m-0">
                                Yes, for now our team manages the communities.
                            </p>
                        </AccordionTab>
                        <AccordionTab className='p-accordion-header' header="Can I become a community manager?">
                            <p className="m-0">
                                For now, our policy is to manage the different community groups.
                            </p>
                        </AccordionTab>
                    </Accordion>
                </div>
            </div>
        </div>
        );
    }
export default Faqs;