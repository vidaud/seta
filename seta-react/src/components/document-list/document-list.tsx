import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../../services/product.service';
// import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Rating } from 'primereact/rating';
import './style.css';

const DocumentList = () => {
    const [products, setProducts] = useState([]);
    const productService = new ProductService();
    const isMounted = useRef(false);
    const toast = useRef(null);
    const [expandedRows, setExpandedRows] = useState(null);

    useEffect(() => {
        isMounted.current = true;
        productService.getProductsWithOrdersSmall().then(data => setProducts(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onRowExpand = (event) => {
    }

    const onRowCollapse = (event) => {
    }

    // const expandAll = () => {
    //     let _expandedRows = {};
    // }

    // const collapseAll = () => {
    //     setExpandedRows(null);
    // }

    // const formatCurrency = (value) => {
    //     return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    // }

    // const amountBodyTemplate = (rowData) => {
    //     return formatCurrency(rowData.amount);
    // }

    // const statusOrderBodyTemplate = (rowData) => {
    //     return <span className={`order-badge order-${rowData.status.toLowerCase()}`}>{rowData.status}</span>;
    // }

    // const searchBodyTemplate = () => {
    //     return <Button icon="pi pi-search" />;
    // }

    // const imageBodyTemplate = (rowData) => {
    //     return <img src={`images/product/${rowData.image}`} onError={(e) => e} alt={rowData.image} className="product-image" />;
    // }

    // const priceBodyTemplate = (rowData) => {
    //     return formatCurrency(rowData.price);
    // }

    // const ratingBodyTemplate = (rowData) => {
    //     return <Rating value={rowData.rating} readOnly cancel={false} />;
    // }

    // const statusBodyTemplate = (rowData) => {
    //     return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    // }

    // const allowExpansion = (rowData) => {
    //     return rowData.orders.length > 0;
    // };

    const columns = [
        {field: 'score', header: 'Score'},
        {field: 'title', header: 'Title'},
        {field: 'source', header: 'Source'},
        {field: 'collection', header: 'Collection'},
        {field: 'reference', header: 'Reference'},
        {field: 'year', header: 'Year'}
    ];
    const [selectedColumns, setSelectedColumns] = useState(columns);
    const onColumnToggle = (event) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter(col => selectedColumns.some(sCol => sCol.field === col.field));
        setSelectedColumns(orderedSelectedColumns);
    }
    const columnComponents = selectedColumns.map(col=> {
        return <Column key={col.field} field={col.field} header={col.header} />;
    });
    
    const header = (
        <div style={{ width:'100%', display: '-webkit-box' }}>
            <div className="table-header-container" style={{ width:'50%' }}>
                <Button icon="pi pi-plus" label="Expand All"  className="mr-2" />
                <Button icon="pi pi-minus" label="Collapse All"  />
            </div>
            <div style={{ width:'50%' }}>
                <MultiSelect value={selectedColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{width:'60%'}}/>
            </div>
        </div>
    );

    return (
        <div className="datatable-rowexpansion-demo">

            <div className="card list">
                <DataTable value={products}
                    onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} responsiveLayout="scroll"
                    dataKey="id" header={header}>
                    <Column style={{ width: '3em' }} />
                    {columnComponents}
                </DataTable>
            </div>
        </div>
    );
}

export default DocumentList;