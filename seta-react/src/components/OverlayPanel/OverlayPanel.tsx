import './style.css'
import { OverlayPanel } from 'primereact/overlaypanel'

import EnrichQueryButton from './components/EnrichQueryButton'
import RelatedTermsList from './components/RelatedTermsList/RelatedTermsList'
import SearchTypeDropdown from './components/SearchTypeDropdown'
import SelectAllTerms from './components/SelectAllTerms'
import SimilarsSelect from './components/SimilarsSelect'
import SuggestionsSelect from './components/SuggestionsSelect'

import { useSearchContext } from '../../context/search-context'

export const OverlayPanelDialog = () => {
  const searchContext = useSearchContext()

  return (
    <OverlayPanel
      ref={searchContext?.op}
      showCloseIcon
      id="overlay_panel1"
      style={{ width: '55%', left: '19%' }}
      className="overlay_panel"
    >
      <div className="overlayPanelHeader">
        <div className="div-size-1">
          <h5>Autocomplete</h5>
        </div>
        <div className="alingItems">
          <div className="div-size-button">
            {searchContext?.inputText ? <SelectAllTerms /> : <span />}
          </div>
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
          {searchContext?.selectedTypeSearch.code === 'RC' &&
          searchContext?.enrichQuery === false ? (
            <>
              <RelatedTermsList />
            </>
          ) : searchContext?.selectedTypeSearch.code === 'RT' &&
            searchContext?.enrichQuery === false ? (
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
