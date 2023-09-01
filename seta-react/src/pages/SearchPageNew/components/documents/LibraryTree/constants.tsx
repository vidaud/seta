import { CgFileDocument } from 'react-icons/cg'
import { FaFolder, FaFolderOpen, FaHome } from 'react-icons/fa'

import { LibraryItemType, type LibraryItem } from '~/types/library/library-item'
import { ROOT_LIBRARY_ITEM_NAME } from '~/utils/library-utils'

import * as S from './styles'

export const ROOT_NODE_ID = 'root'

export const ROOT_NODE: LibraryItem = {
  id: ROOT_NODE_ID,
  parentId: null,
  type: LibraryItemType.Folder,
  order: 0,
  title: ROOT_LIBRARY_ITEM_NAME,
  path: [ROOT_LIBRARY_ITEM_NAME],
  children: []
}

export const FOLDER_ICON = <FaFolder preserveAspectRatio="none" css={S.folderIcon} />
export const FOLDER_ICON_OPEN = <FaFolderOpen preserveAspectRatio="none" css={S.folderOpenIcon} />
export const FILE_ICON = <CgFileDocument css={S.fileIcon} />
export const ROOT_ICON = <FaHome />
