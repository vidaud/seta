import { CgFileDocument } from 'react-icons/cg'
import { FaFolder, FaFolderOpen, FaHome } from 'react-icons/fa'

import * as S from './styles'

export const FOLDER_ICON = <FaFolder preserveAspectRatio="none" css={S.folderIcon} />
export const FOLDER_ICON_OPEN = <FaFolderOpen preserveAspectRatio="none" css={S.folderOpenIcon} />
export const FILE_ICON = <CgFileDocument css={S.fileIcon} />
export const ROOT_ICON = <FaHome />
