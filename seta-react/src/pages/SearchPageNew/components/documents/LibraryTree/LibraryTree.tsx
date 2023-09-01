import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'

import UnderDevelopment from '~/components/UnderDevelopment'

import type { ClassNameProp } from '~/types/children-props'
import type { DataProps } from '~/types/data-props'
import type { LibraryItem, LibraryItemRaw } from '~/types/library/library-item'
import { getLibraryTree } from '~/utils/library-utils'

import { ErrorState, LoadingState, onSelectChild } from './common'
import { ROOT_NODE } from './constants'
import type { DocumentsTreeOptions } from './contexts/documents-tree-context'
import { DocumentsTreeProvider } from './contexts/documents-tree-context'
import LibraryNode from './LibraryNode'
import * as S from './styles'

// Lazy load the tree actions provider to avoid circular dependency when rendering the Move action
const TreeActionsProviderLazy = lazy(() => import('./contexts/tree-actions-context'))

type Props = DataProps<LibraryItemRaw[]> & {
  excludeItem?: LibraryItem
  onSelectedChange?: (item?: LibraryItem) => void
} & DocumentsTreeOptions &
  ClassNameProp

const LibraryTree = ({
  data = [],
  excludeItem,
  isLoading,
  error,
  selectable,
  autoSelect,
  noActionMenu,
  onSelectedChange,
  onTryAgain,
  className,
  ...options
}: Props) => {
  const [selected, setSelected] = useState<LibraryItem | undefined>()

  const onSelectedChangeRef = useRef(onSelectedChange)

  const dataTree = useMemo(() => getLibraryTree(data, excludeItem), [data, excludeItem])

  const rootNode: LibraryItem = useMemo(
    () => ({
      ...ROOT_NODE,
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
    return <ErrorState onTryAgain={onTryAgain} />
  }

  if (isLoading || !data) {
    return <LoadingState />
  }

  const handleSelect = (item?: LibraryItem) => {
    if (!selectable) {
      return
    }

    setSelected(item)
    onSelectedChange?.(item)
  }

  const handleSelectChild = (parent: LibraryItem, childId: string) => {
    onSelectChild(parent, childId, handleSelect)
  }

  const node = <LibraryNode item={rootNode} isRoot css={S.rootNode} />

  // Only render the actions provider if the action menu is enabled
  const content = noActionMenu ? (
    node
  ) : (
    <Suspense fallback={null}>
      <TreeActionsProviderLazy>{node}</TreeActionsProviderLazy>
    </Suspense>
  )

  return (
    <div className={className}>
      <UnderDevelopment mb="md" />

      <DocumentsTreeProvider
        {...options}
        rootNode={rootNode}
        noActionMenu={noActionMenu}
        selectable={selectable}
        selected={selected}
        onSelect={handleSelect}
        selectChild={handleSelectChild}
      >
        {content}
      </DocumentsTreeProvider>
    </div>
  )
}

export default LibraryTree
