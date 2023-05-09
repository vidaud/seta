import { Box } from '@mantine/core'

import { useSearchInput } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-input-context'

import { useSuggestions } from '~/api/search/suggestions'

import AutocompleteContent from './AutocompleteContent'

import { useSearch } from '../SuggestionsPopup/contexts/search-context'

type Props = {
  className?: string
}

const AutocompleteSuggestions = ({ className }: Props) => {
  const { onSuggestionSelected, currentToken } = useSearch()
  const { setPositionDelayed } = useSearchInput()

  const searchTerm = currentToken?.rawValue

  const { data, isLoading, error, refetch } = useSuggestions(searchTerm)

  const handleSuggestionSelected = (suggestion: string) => {
    onSuggestionSelected?.(suggestion)

    if (!currentToken) {
      return
    }

    const position = currentToken.index + suggestion.length + (suggestion.match(/\s/g) ? 2 : 0)

    setPositionDelayed(position, 0)
  }

  return (
    <Box className={className}>
      <AutocompleteContent
        hasSearchTerm={!!searchTerm}
        data={data}
        isLoading={isLoading}
        error={error}
        currentWord={searchTerm}
        onSelect={handleSuggestionSelected}
        onTryAgain={refetch}
      />
    </Box>
  )
}

export default AutocompleteSuggestions
