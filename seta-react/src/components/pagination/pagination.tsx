import { useState } from 'react';
import { Paginator } from 'primereact';
import './style.css';

const Pagination = () => {
    const [basicFirst, setBasicFirst] = useState(0);
    const [basicRows, setBasicRows] = useState(10);

    const onBasicPageChange = (event: any) => {
        setBasicFirst(event.first);
        setBasicRows(event.rows);
    }

    return (
        <div className="paginator-demo">
            <div className="card">
                <Paginator first={basicFirst} rows={basicRows} totalRecords={120} rowsPerPageOptions={[10, 20, 30]} onPageChange={onBasicPageChange}></Paginator>
            </div>
        </div>
    );
}

export default Pagination;