import { SuggestionsError, SuggestionsLoading } from '~/pages/SearchPageNew/components/common'

import type { LibraryItem } from '~/types/library/library-item'
import { LibraryItemType } from '~/types/library/library-item'

export const ErrorState = ({ onTryAgain }: { onTryAgain?: () => void }) => (
  <SuggestionsError
    size="md"
    mt={0}
    subject="the library folders"
    withIcon
    onTryAgain={onTryAgain}
  />
)

export const LoadingState = () => (
  <SuggestionsLoading size="md" mt={0} color="blue" variant="bars" />
)

export const onSelectChild = (
  parent: LibraryItem,
  childId: string,
  handleSelect: (item?: LibraryItem) => void
) => {
  if (parent.type !== LibraryItemType.Folder) {
    return
  }

  const child = parent.children.find(({ id }) => id === childId)

  if (child) {
    handleSelect(child)
  }
}
