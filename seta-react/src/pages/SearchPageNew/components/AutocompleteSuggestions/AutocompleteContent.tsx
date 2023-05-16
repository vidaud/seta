import type { ListMenuProps } from '~/components/ListMenu'
import ListMenu from '~/components/ListMenu'
import {
  SuggestionsError,
  SuggestionsLoading,
  SuggestionsEmpty
} from '~/pages/SearchPageNew/components/common'

import type { SuggestionsResponse } from '~/api/search/suggestions'
import type { DataProps } from '~/types/data-props'

type Props = Omit<ListMenuProps, 'items'> & {
  hasSearchTerm: boolean
} & DataProps<SuggestionsResponse>

const AutocompleteContent = ({
  hasSearchTerm,
  data,
  isLoading,
  error,
  onTryAgain,
  ...props
}: Props) => {
  if (error) {
    return <SuggestionsError onTryAgain={onTryAgain} />
  }

  if (isLoading || !data) {
    return <SuggestionsLoading />
  }

  const info = hasSearchTerm ? 'No suggestions' : 'Start typing to see suggestions'

  const suggestions = data.words

  if (!suggestions.length) {
    return <SuggestionsEmpty message={info} />
  }

  return <ListMenu items={suggestions} {...props} />
}

export default AutocompleteContent
