import { useContext } from 'react'
import './style.css'
import { Button } from 'primereact/button'

import { SearchContext, useSearchContext } from '../../../../context/search-context'
import magic_icon from '../../../../icons/svg/magic_icon.svg'
import magic_icon_fill from '../../../../icons/svg/magic_icon_fill.svg'
import type Search from '../../../../types/search'

export const EnrichQueryButton = () => {
  const searchContext = useSearchContext()
  const { enrichQuery, setEnrichQuery } = useContext(SearchContext) as Search

  const toggleEnrichButton = () => {
    const toggled = !enrichQuery

    setEnrichQuery(toggled)
    searchContext.toggleEnrichQuery(toggled)
  }

  return (
    <Button
      className={enrichQuery ? 'custom-magic' : 'custom-magic magic'}
      tooltip="Enrich query automatically"
      tooltipOptions={{ position: 'bottom' }}
      onClick={toggleEnrichButton}
    >
      {enrichQuery ? (
        <img src={magic_icon_fill} alt="Enrich Query" />
      ) : (
        <img src={magic_icon} alt="Enrich Query" />
      )}
    </Button>
  )
}

export default EnrichQueryButton
