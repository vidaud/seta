import './style.css'
import { Button } from 'primereact/button'

import { useSearchContext } from '../../../../context/search-context'
import magic_icon from '../../../../icons/svg/magic_icon.svg'
import magic_icon_fill from '../../../../icons/svg/magic_icon_fill.svg'

export const EnrichQueryButton = () => {
  const searchContext = useSearchContext()

  const toggleEnrichButton = () => {
    const toggled = !searchContext?.enrichQuery

    searchContext?.setEnrichQuery(toggled)
    searchContext?.toggleEnrichQuery(toggled)
  }

  return (
    <Button
      className={searchContext?.enrichQuery ? 'custom-magic' : 'custom-magic magic'}
      tooltip="Enrich query automatically"
      tooltipOptions={{ position: 'bottom' }}
      onClick={toggleEnrichButton}
    >
      {searchContext?.enrichQuery ? (
        <img src={magic_icon_fill} alt="Enrich Query" />
      ) : (
        <img src={magic_icon} alt="Enrich Query" />
      )}
    </Button>
  )
}

export default EnrichQueryButton
