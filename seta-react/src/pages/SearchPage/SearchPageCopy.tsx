import { useRef, useState } from 'react'
import { BreadCrumb } from 'primereact/breadcrumb'
import type { OverlayPanel } from 'primereact/overlaypanel'

import { itemsBreadCrumb, home } from './constants'

import './style.css'

import DialogButton from '../../components/DialogButton'
import SearchSection from '../../components/SearchSection'
import TabMenus from '../../components/TabMenu'
import type { Term } from '../../models/term.model'

const SearchPage = () => {
  const [showContent, setShowContent] = useState(false)
  const [term, setTerm] = useState<Term[]>([])
  const [items, setItems] = useState([])
  const [aggregations, setAggregations] = useState([])
  const [documentList, setDocumentList] = useState([])
  const [typeofSearch, setTypeofSearch] = useState()
  const [timeRangeValue, setTimeRangeValue] = useState()
  const op = useRef<OverlayPanel>(null)

  const getDocumentList = () => {
    setDocumentList(items)
  }

  const getTextValue = text => {
    if (text !== '') {
      setTerm(text)
    }
  }

  const getFileName = filename => {
    if (filename !== '') {
      setTerm(filename)
    }
  }

  const toggleListVisibility = show => {
    if (show) {
      setShowContent(true)
    }
  }

  const getSelectedSuggestion = value => {
    if (value !== '') {
      setTerm(value)
    }
  }

  const getAggregations = value => {
    setAggregations(value)
  }

  const getItems = value => {
    setItems(value)
  }

  return (
    <>
      <BreadCrumb model={itemsBreadCrumb} home={home} />
      <div className="page">
        {showContent ? null : <div>Discover and Link Knowledge in EU Documents</div>}
        <div className="col-8">
          <div className="p-inputgroup">
            <DialogButton
              onChange={getDocumentList}
              onChangeText={getTextValue}
              onChangeFile={getFileName}
              onChangeContentVisibility={toggleListVisibility}
            />
            <SearchSection
              current_search={term}
              op={op}
              onChangeTerm={getSelectedSuggestion}
              typeofSearch={typeofSearch}
              timeRangeValue={timeRangeValue}
              onChangeItems={getItems}
              onChangeAggregations={getAggregations}
              onChangeShowContent={toggleListVisibility}
            />
          </div>
        </div>
        <div>
          {showContent ? (
            <TabMenus
              data={items}
              term={term}
              aggregations={aggregations}
              typeofSearch={typeofSearch}
              setTypeofSearch={setTypeofSearch}
              timeRangeValue={timeRangeValue}
              setTimeRangeValue={setTimeRangeValue}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}

export default SearchPage
