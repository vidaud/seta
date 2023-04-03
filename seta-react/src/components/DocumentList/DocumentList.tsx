import { useState, useEffect, useRef } from 'react'
import { Column } from 'primereact/column'
import type { DataTableExpandedRows } from 'primereact/datatable'
import { DataTable } from 'primereact/datatable'
import { MultiSelect } from 'primereact/multiselect'
import { ProgressBar } from 'primereact/progressbar'
import './style.css'

const DocumentList = list => {
  const isMounted = useRef(false)
  const [items, setItems] = useState<any>([])
  const [basicFirst, setBasicFirst] = useState(0)
  const [basicRows, setBasicRows] = useState(10)

  // DataTable.onRowToggle sends this type (including any[]) as e.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows | undefined>(
    undefined
  )

  useEffect(() => {
    const documentsList = list.documents.data

    setItems(documentsList)
    isMounted.current = true
  }, [expandedRows, list])

  const onBasicPageChange = (event: any) => {
    setBasicFirst(event.first)
    setBasicRows(event.rows)
  }

  const statusTemplate = rowData => {
    return (
      <span
        className={`document-badge status-${rowData.source ? rowData.source.toLowerCase() : ''}`}
      >
        {rowData.source}
      </span>
    )
  }

  const activityBodyTemplate = rowData => {
    return <ProgressBar value={rowData.score} showValue={false} />
  }

  const allowExpansion = rowData => {
    return rowData.chunk_text !== null
  }

  const columns = [
    { field: 'score', header: 'Score' },
    { field: 'title', header: 'Title' },
    { field: 'source', header: 'Source' },
    { field: 'collection', header: 'Collection' },
    { field: 'reference', header: 'Reference' },
    { field: 'date', header: 'Year' }
  ]
  const [selectedColumns, setSelectedColumns] = useState(columns)
  const onColumnToggle = event => {
    const selectedColumns = event.value
    const orderedSelectedColumns = columns.filter(col =>
      selectedColumns.some(sCol => sCol.field === col.field)
    )

    setSelectedColumns(orderedSelectedColumns)
  }
  const columnComponents = selectedColumns.map(col => {
    if (col.field === 'source') {
      return <Column key={col.field} field={col.field} body={statusTemplate} header={col.header} />
    } else if (col.field === 'score') {
      return (
        <Column
          key={col.field}
          field={col.field}
          showFilterMatchModes={false}
          sortable
          body={activityBodyTemplate}
          header={col.header}
        />
      )
    } else if (col.field === 'date') {
      return <Column key={col.field} field={col.field} header={col.header} sortable />
    }

    return <Column key={col.field} field={col.field} header={col.header} />
  })

  const rowExpansionTemplate = data => {
    return (
      <div className="orders-subtable">
        <table className="context-table">
          <tbody>
            <tr>
              <td>
                <span className="table-headers">Collection:</span> {data.collection}
              </td>
              <td>
                <span className="table-headers">Document reference:</span> {data.reference}
              </td>
            </tr>
            <tr>
              <td>
                <span className="table-headers">Date:</span> {data.date}
              </td>
              <td>
                <span className="table-headers">Source:</span> {data.source}
              </td>
            </tr>
            <tr>
              <td>
                <span className="table-headers">Eurovoc concepts:</span> {data.eurovoc_concept}
              </td>
              <td>
                <span className="table-headers">In force:</span> {data.in_force}
              </td>
            </tr>
          </tbody>
        </table>
        <DataTable
          value={data.concordance}
          responsiveLayout="scroll"
          scrollable
          scrollHeight="400px"
        >
          <Column field="0" header="Left Context" sortable />
          <Column field="1" header="Keyword" sortable />
          <Column field="2" header="Right Context" sortable />
        </DataTable>
      </div>
    )
  }

  const header = (
    <div style={{ width: '100%', display: '-webkit-box' }}>
      {/* TODO: Delete the following line after verifying that there are no side effects */}
      <div className="table-header-container" style={{ width: '50%' }} />
      <div style={{ width: '50%' }}>
        <MultiSelect
          value={selectedColumns}
          options={columns}
          optionLabel="header"
          onChange={onColumnToggle}
          style={{ width: '60%' }}
        />
      </div>
    </div>
  )

  return (
    <div className="datatable-rowexpansion">
      <div className="card list">
        <DataTable
          value={items}
          paginator
          expandedRows={expandedRows}
          onRowToggle={e => setExpandedRows(e.data)}
          dataKey="_id"
          rowExpansionTemplate={rowExpansionTemplate}
          first={basicFirst}
          rows={basicRows}
          totalRecords={items?.length}
          rowsPerPageOptions={[5, 10, 20, 30]}
          onPage={onBasicPageChange}
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          responsiveLayout="scroll"
          header={header}
        >
          <Column expander={allowExpansion} style={{ width: '3em' }} />
          {columnComponents}
        </DataTable>
      </div>
    </div>
  )
}

export default DocumentList
