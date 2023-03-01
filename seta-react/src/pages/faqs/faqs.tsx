import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { BreadCrumb } from 'primereact/breadcrumb';
import { ScrollTop } from 'primereact/scrolltop';
import { Accordion, AccordionTab } from 'primereact/accordion';
import './style.css';
import { FaqsService } from "../../services/FaqsService";

const Faqs = () => {
    const faqsService = new FaqsService();
    const [html, setHtml] = useState<string>("")
    const [faqs, setFaqs] = useState<any>(faqsService.getFaqsData);
    const [searchfaqs, setSearchFaqs] = useState<any>(faqs[0].items);

    const breadCrumbsItems = [
        {label: 'Faqs', url: '/seta-ui/faqs'}
    ];

    useEffect(() => {
        setHtml("<div>Html stored as a string</div>")
    }, [html]);

    const home = { icon: 'pi pi-home', url: '/seta-ui' }
   
    return (
    <><BreadCrumb model={breadCrumbsItems} home={home} />
        <div className='page'>
        <h1 className="headerH">FAQs</h1>
            <div className='card'>
                <ScrollTop />
                <div className="col-10">
                    <div className="accordion-demo">
                            <Accordion >
                                {searchfaqs.map((searchData) => {
                                    return (
                                        <AccordionTab className='p-accordion-header' header={searchData.label}>
                                            {searchData.body.map((searchDetData) => {
                                                return (
                                                    <p className="m-0">
                                                        {parse(searchDetData.question)}<br></br>{parse(searchDetData.answer)}
                                                    </p>
                                                    
                                                    );
                                                })}
                                        </AccordionTab>
                                    );
                                })}
                            </Accordion>
                            <ScrollTop target="parent" threshold={100} className="custom-scrolltop" icon="pi pi-arrow-up" />
                    </div>
                </div>
            </div>
        </div>
    </>
        );
    }
export default Faqs;