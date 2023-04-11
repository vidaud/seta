import { useState, useContext } from 'react'
import { BreadCrumb } from 'primereact/breadcrumb'

import { itemsBreadCrumb, home } from './constants'
import './style.css'

import DialogButton from '../../components/DialogButton'
import SearchSection from '../../components/SearchSection'
import TabMenus from '../../components/TabMenu'
import { SearchContext } from '../../context/search-context'
import type Search from '../../types/search'

const SearchPage = () => {
  const { items, setTerm, setShowContent, showContent } = useContext(SearchContext) as Search
  const [documentList, setDocumentList] = useState<any>([])

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
            <SearchSection />
          </div>
        </div>
        <div>{showContent ? <TabMenus /> : null}</div>
      </div>
    </>
  )
}

export default SearchPage
