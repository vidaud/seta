import { useMemo } from 'react'
import { Flex, Group } from '@mantine/core'
import { CgFileDocument } from 'react-icons/cg'
import { FaFolder } from 'react-icons/fa'

import { LibraryItemType, type LibraryItem } from '~/types/library/library-item'

import * as S from './styles'

type Props = {
  libraryItem: LibraryItem
}

const ItemSource = ({ libraryItem }: Props) => {
  const path = useMemo(
    // The path elements don't change between renders
    // eslint-disable-next-line react/no-array-index-key
    () => libraryItem.path.map((p, index) => <div key={index}>{p}</div>),
    [libraryItem.path]
  )

  const icon =
    libraryItem.type === LibraryItemType.Folder ? (
      <FaFolder preserveAspectRatio="none" css={S.folderIcon} />
    ) : (
      <CgFileDocument css={S.fileIcon} />
    )

  return (
    <Flex gap="xs" align="center">
      {icon}

      <Group css={S.path} spacing={0}>
        {path}
      </Group>
    </Flex>
  )
}

export default ItemSource
