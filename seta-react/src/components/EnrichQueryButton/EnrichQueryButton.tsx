import './style.css'
import { useState } from 'react'
import { Button } from 'primereact/button'

import magic_icon from '../../icons/svg/magic_icon.svg'
import magic_icon_fill from '../../icons/svg/magic_icon_fill.svg'

export const EnrichQueryButton = ({ onToggleEnrichQuery }) => {
  const [enrichButton, setEnrichButton] = useState(false)

  const toggleEnrichButton = () => {
    const toggled = !enrichButton

    setEnrichButton(toggled)
    onToggleEnrichQuery(toggled)
  }

  return (
    <Button
      className={enrichButton ? 'custom-magic' : 'custom-magic magic'}
      tooltip="Enrich query automatically"
      tooltipOptions={{ position: 'bottom' }}
      onClick={toggleEnrichButton}
    >
      {enrichButton ? (
        <img src={magic_icon_fill} alt="Enrich Query" />
      ) : (
        <img src={magic_icon} alt="Enrich Query" />
      )}
    </Button>
  )
}

export default EnrichQueryButton
