import type { ReactElement } from 'react'
import { css } from '@emotion/react'
import { Collapse } from '@mantine/core'

import ChevronToggleIcon from '~/components/ChevronToggleIcon'

import EmptyState from '../components/EmptyState'
import { FILE_ICON, FOLDER_ICON, FOLDER_ICON_OPEN, ROOT_ICON } from '../constants'

type Args = {
  isFolder: boolean
  isRoot: boolean | undefined
  isExpanded: boolean
  foldersOnly?: boolean
  folderContent: ReactElement[]
}

const toggleIconStyle = css`
  grid-column: 1;
`

const useNodeContent = ({ isFolder, isRoot, isExpanded, foldersOnly, folderContent }: Args) => {
  const isEmpty = folderContent.length === 0

  const content = isFolder && (
    <Collapse in={isExpanded}>
      {isRoot && isEmpty ? (
        <EmptyState foldersOnly={foldersOnly} noArrow={foldersOnly} centerMessage={foldersOnly} />
      ) : (
        folderContent
      )}
    </Collapse>
  )

  const toggleIcon = isFolder && (
    <ChevronToggleIcon
      start="right"
      end="down"
      size="sm"
      toggled={isExpanded}
      css={toggleIconStyle}
    />
  )

  const icon = isRoot
    ? ROOT_ICON
    : isFolder
    ? isExpanded
      ? FOLDER_ICON_OPEN
      : FOLDER_ICON
    : FILE_ICON

  return {
    content,
    toggleIcon,
    icon
  }
}

export default useNodeContent
