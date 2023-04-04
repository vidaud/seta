import { useState } from 'react'
import { BreadCrumb } from 'primereact/breadcrumb'

import { itemsBreadCrumb, home } from './constants'
import './style.css'

import DialogButton from '../../components/DialogButton'
import SearchSection from '../../components/SearchSection'
import TabMenus from '../../components/TabMenu'
import { useSearchContext } from '../../context/search-context'

const SearchPage = () => {
  const searchContext = useSearchContext()
  const [documentList, setDocumentList] = useState<any>([])

  const getDocumentList = () => {
    setDocumentList(searchContext?.items)
  }

  const getTextValue = text => {
    if (text !== '') {
      searchContext?.setTerm(text)
    }
  }

  const getFileName = filename => {
    if (filename !== '') {
      searchContext?.setTerm(filename)
    }
  }

  const toggleListVisibility = show => {
    if (show) {
      searchContext?.setShowContent(true)
    }
  }

  return (
    <>
      <BreadCrumb model={itemsBreadCrumb} home={home} />
      <div className="page">
        {searchContext?.showContent ? null : <div>Discover and Link Knowledge in EU Documents</div>}
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
        <div>{searchContext?.showContent ? <TabMenus /> : null}</div>
      </div>
    </>
  )
}

export default SearchPage
