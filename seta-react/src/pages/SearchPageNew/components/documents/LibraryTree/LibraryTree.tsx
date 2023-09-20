import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'

import UnderDevelopment from '~/components/UnderDevelopment'

import type { ClassNameProp } from '~/types/children-props'
import type { DataProps } from '~/types/data-props'
import type { LibraryItem } from '~/types/library/library-item'

import { ErrorState, LoadingState, onSelectChild } from './common'
import { ROOT_NODE } from './constants'
import type { DocumentsTreeOptions } from './contexts/documents-tree-context'
import { DocumentsTreeProvider } from './contexts/documents-tree-context'
import { RootActionsProvider } from './contexts/root-actions-context'
import LibraryNode from './LibraryNode'
import * as S from './styles'

// Lazy load the tree actions provider to avoid circular dependency when rendering the Move action
const TreeActionsProviderLazy = lazy(() => import('./contexts/tree-actions-context'))

type Props = DataProps<LibraryItem[]> & {
  onSelectedChange?: (item?: LibraryItem) => void
} & DocumentsTreeOptions &
  ClassNameProp

const LibraryTree = ({
  data = [],
  isLoading,
  error,
  selectable,
  autoSelectRoot,
  noActionMenu,
  onSelectedChange,
  onTryAgain,
  className,
  ...options
}: Props) => {
  const [selected, setSelected] = useState<LibraryItem | undefined>()

  const onSelectedChangeRef = useRef(onSelectedChange)

  const rootNode: LibraryItem = useMemo(
    () => ({
      ...ROOT_NODE,
      children: data
    }),
    [data]
  )

  const canAutoSelect = autoSelectRoot && !selected && !isLoading && !error

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
        <RootActionsProvider>{content}</RootActionsProvider>
      </DocumentsTreeProvider>
    </div>
  )
}

export default LibraryTree
