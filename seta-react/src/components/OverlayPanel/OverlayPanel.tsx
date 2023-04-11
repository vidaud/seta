import './style.css'
import { useContext } from 'react'
import { OverlayPanel } from 'primereact/overlaypanel'

import EnrichQueryButton from './components/EnrichQueryButton'
import RelatedTermsList from './components/RelatedTermsList/RelatedTermsList'
import SearchTypeDropdown from './components/SearchTypeDropdown'
import SelectAllTerms from './components/SelectAllTerms'
import SimilarsSelect from './components/SimilarsSelect'
import SuggestionsSelect from './components/SuggestionsSelect'

import { SearchContext } from '../../context/search-context'
import type Search from '../../types/search'

export const OverlayPanelDialog = () => {
  const { op, inputText, selectedTypeSearch, enrichQuery } = useContext(SearchContext) as Search

  return (
    <OverlayPanel
      ref={op}
      showCloseIcon
      id="overlay_panel1"
      style={{ width: '55%', left: '19%' }}
      className="overlay_panel"
    >
      <div className="overlayPanelHeader">
        <div className="div-size-1">
          <h5>Autocomplete</h5>
        </div>
        <div className="alignItems">
          <div className="div-size-button">{inputText ? <SelectAllTerms /> : <span />}</div>
          <div className="search_dropdown div-size-2">
            <EnrichQueryButton />
            <SearchTypeDropdown />
          </div>
        </div>
      </div>
      <div className="overlayPanelBody">
        <div className="div-size-1">
          <>
            <div className="card flex justify-content-center">
              <SuggestionsSelect />
            </div>
          </>
        </div>
        <div className="div-size-2">
          {selectedTypeSearch.code === 'RC' && enrichQuery === false ? (
            <>
              <RelatedTermsList />
            </>
          ) : selectedTypeSearch.code === 'RT' && enrichQuery === false ? (
            <>
              <div className="card flex justify-content-center similars">
                <SimilarsSelect />
              </div>
            </>
          ) : (
            <div />
          )}
        </div>
      </div>
    </OverlayPanel>
  )
}

export default OverlayPanelDialog
