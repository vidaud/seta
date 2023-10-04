import { FiExternalLink } from 'react-icons/fi'

import ColoredActionIcon from '~/components/ColoredActionIcon'

import type { LibraryItem } from '~/types/library/library-item'
import { LibraryItemType } from '~/types/library/library-item'

type Props = {
  item: LibraryItem
}

const DocumentLinkAction = ({ item }: Props) => {
  if (item.type !== LibraryItemType.Document || !item.link) {
    return null
  }

  const handleClick = () => {
    if (!item.link) {
      return
    }

    window.open(item.link, '_blank')
  }

  return (
    <ColoredActionIcon color="blue" tooltip="Open external document link" onClick={handleClick}>
      <FiExternalLink size={18} strokeWidth={3} />
    </ColoredActionIcon>
  )
}

export default DocumentLinkAction
