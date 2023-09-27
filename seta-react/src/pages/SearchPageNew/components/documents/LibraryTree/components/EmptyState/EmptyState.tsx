import { Flex, Text } from '@mantine/core'
import { ImFilesEmpty } from 'react-icons/im'

import { FOLDER_ICON } from '~/pages/SearchPageNew/components/documents/LibraryTree/constants'

import LargeArrow from '~/icons/LargeArrow'

import * as S from './styles'

const PLUS_HINT = 'Click the Plus button to create a new folder'

type Props = {
  foldersOnly?: boolean
  noArrow?: boolean
  noDescription?: boolean
  centerMessage?: boolean
}

const EmptyState = ({ foldersOnly, noArrow, noDescription, centerMessage }: Props) => {
  const message = foldersOnly ? (
    // Must use fragments to allow <br /> interpolation
    <>
      {PLUS_HINT} <br /> or save the document(s) at the root of your library.
    </>
  ) : (
    <>
      {PLUS_HINT} <br /> and save documents from the search results to organize your library.
    </>
  )

  const icon = foldersOnly ? (
    <div css={[S.icon, S.folderIcon]}>{FOLDER_ICON}</div>
  ) : (
    <ImFilesEmpty size={24} css={S.icon} />
  )

  return (
    <Flex direction="column" align="center" justify="center" gap="sm" css={S.root}>
      {icon}

      <Text>Nothing here yet.</Text>

      {!noArrow && <LargeArrow css={S.arrow} />}

      {!noDescription && (
        <Text fz="sm" color="gray.8" ta={centerMessage ? 'center' : undefined}>
          {message}
        </Text>
      )}
    </Flex>
  )
}

export default EmptyState
