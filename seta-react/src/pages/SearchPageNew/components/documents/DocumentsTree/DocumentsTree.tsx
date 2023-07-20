import { useEffect, useMemo, useRef, useState } from 'react'

import UnderDevelopment from '~/components/UnderDevelopment'
import { SuggestionsError, SuggestionsLoading } from '~/pages/SearchPageNew/components/common'

import { useCreateNewFolder } from '~/api/search/library'
import type { ClassNameProp } from '~/types/children-props'
import type { DataProps } from '~/types/data-props'
import { LibraryItemType } from '~/types/library/library-item'
import type { LibraryItem, LibraryItemRaw } from '~/types/library/library-item'
import { getLibraryTree, ROOT_LIBRARY_ITEM_NAME } from '~/utils/library-utils'

import type { DocumentsTreeOptions } from './contexts/documents-tree-context'
import { DocumentsTreeProvider } from './contexts/documents-tree-context'
import DocumentNode from './DocumentNode'
import * as S from './styles'

type Props = DataProps<LibraryItemRaw[]> & {
  onSelectedChange?: (item?: LibraryItem) => void
} & DocumentsTreeOptions &
  ClassNameProp

const DocumentsTree = ({
  data = [],
  isLoading,
  error,
  selectable,
  autoSelect,
  onSelectedChange,
  onTryAgain,
  className,
  ...options
}: Props) => {
  const [selected, setSelected] = useState<LibraryItem | undefined>()

  const onSelectedChangeRef = useRef(onSelectedChange)

  const { mutateAsync: createNewFolder } = useCreateNewFolder()

  const dataTree = useMemo(() => getLibraryTree(data), [data])

  const rootNode: LibraryItem = useMemo(
    () => ({
      id: 'root',
      type: LibraryItemType.Folder,
      order: 0,
      title: ROOT_LIBRARY_ITEM_NAME,
      path: [ROOT_LIBRARY_ITEM_NAME],
      children: dataTree
    }),
    [dataTree]
  )

  const canAutoSelect = autoSelect && !selected && !isLoading && !error

  useEffect(() => {
    if (canAutoSelect) {
      setSelected(rootNode)
      onSelectedChangeRef.current?.(rootNode)
    }
  }, [canAutoSelect, rootNode])

  if (error) {
    return (
      <SuggestionsError
        size="md"
        mt={0}
        subject="the library folders"
        withIcon
        onTryAgain={onTryAgain}
      />
    )
  }

  if (isLoading || !data) {
    return <SuggestionsLoading size="md" mt={0} color="blue" variant="bars" />
  }

  const handleSelect = (item?: LibraryItem) => {
    if (!selectable) {
      return
    }

    setSelected(item)
    onSelectedChange?.(item)
  }

  const handleSelectChild = (parent: LibraryItem, childId: string) => {
    if (parent.type !== LibraryItemType.Folder) {
      return
    }

    const child = parent.children.find(({ id }) => id === childId)

    if (child) {
      handleSelect(child)
    }
  }

  const handleNewFolder = async (parentId: string | null, title: string): Promise<string> => {
    const { item } = await createNewFolder({ parentId, title })

    return item.id
  }

  return (
    <div className={className}>
      <UnderDevelopment mb="md" />

      <DocumentsTreeProvider
        {...options}
        rootNode={rootNode}
        selectable={selectable}
        selected={selected}
        onSelect={handleSelect}
        selectChild={handleSelectChild}
        createNewFolder={handleNewFolder}
      >
        <DocumentNode item={rootNode} isRoot css={S.rootNode} />
      </DocumentsTreeProvider>
    </div>
  )
}

export default DocumentsTree
