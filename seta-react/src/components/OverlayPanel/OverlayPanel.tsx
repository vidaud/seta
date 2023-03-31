import './style.css'
import { useState } from 'react'
import { OverlayPanel } from 'primereact/overlaypanel'

import EnrichQueryButton from '../EnrichQueryButton'
import RelatedTermsList from '../RelatedTermsList'
import SearchTypeDropdown from '../SearchTypeDropdown'
import SelectAllTerms from '../SelectAllTerms'
import SimilarsSelect from '../SimilarsSelect'
import SuggestionsSelect from '../SuggestionsSelect'

export const OverlayPanelDialog = props => {
  const [selectAll, setSelectAll] = useState(false)

  const onSelectedAllButton = value => {
    setSelectAll(value)
  }

  return (
    <OverlayPanel
      ref={props.op}
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
            {props.text_focused ? (
              <SelectAllTerms text={props.text_focused} onSelectedAllButton={onSelectedAllButton} />
            ) : (
              <span />
            )}
          </div>
          <div className="search_dropdown div-size-2">
            <EnrichQueryButton onToggleEnrichQuery={props.onToggleEnrichQuery} />
            <SearchTypeDropdown onSelectedTypeSearch={props.onSelectedTypeSearch} />
          </div>
        </div>
      </div>
      <div className="overlayPanelBody">
        <div className="div-size-1">
          <>
            <div className="card flex justify-content-center">
              <SuggestionsSelect
                current_search={props.current_search}
                text_focused={props.text_focused}
                dialog={props.op}
                onChangeTerm={props.onChangeTerm}
              />
            </div>
          </>
        </div>
        <div className="div-size-2">
          {props.selectionValue.code === 'RC' && props.enrichQuery === false ? (
            <>
              <RelatedTermsList
                current_search={props.current_search}
                text_focused={props.text_focused}
                onChangeTerm={props.onChangeTerm}
                onChangeSelectAll={selectAll}
                enrichQueryButton={props.enrichQuery}
                onChangeQuery={props.onChangeQuery}
                listofTerms={props.listofTerms}
              />
            </>
          ) : props.selectionValue.code === 'RT' && props.enrichQuery === false ? (
            <>
              <div className="card flex justify-content-center similars">
                <SimilarsSelect
                  current_search={props.current_search}
                  text_focused={props.text_focused}
                  onChangeTerm={props.onChangeTerm}
                  onChangeSelectAll={selectAll}
                  enrichQueryButton={props.enrichQuery}
                  onChangeQuery={props.onChangeQuery}
                  listofTerms={props.listofTerms}
                />
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
