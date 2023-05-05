import { Box } from '@mantine/core'

import { useSearchInput } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-input-context'

import { useSuggestions } from '~/api/search/suggestions'

import AutocompleteContent from './AutocompleteContent'

import { useSearch } from '../SuggestionsPopup/contexts/search-context'

// const TERMS: string[] = [
//   'test',
//   'testing',
//   'tests',
//   'tested',
//   'test rigs',
//   'test programme',
//   'tested materials',
//   'test facility',
//   'test purposes',
//   'test surfaces',
//   'technology gmbh',
//   'text',
//   'temperature',
//   'temperat',
//   'tem',
//   'temperature level',
//   'temperature differences',
//   'tends'
// ]

type Props = {
  className?: string
}

const AutocompleteSuggestions = ({ className }: Props) => {
  const { onSuggestionSelected, currentToken } = useSearch()
  const { input, setPosition } = useSearchInput()

  const suggestionsFor = currentToken?.rawValue

  const { data, isLoading, error, refetch } = useSuggestions(suggestionsFor)

  const handleSuggestionSelected = (suggestion: string) => {
    onSuggestionSelected?.(suggestion)

    if (!currentToken) {
      return
    }

    // input?.blur()

    setTimeout(() => {
      setPosition(currentToken.index + suggestion.length + (suggestion.match(/\s/g) ? 2 : 0))
      input?.focus()
    }, 0)
  }

  return (
    <Box className={className}>
      <AutocompleteContent
        hasSearchTerm={!!suggestionsFor}
        data={data}
        isLoading={isLoading}
        error={error}
        currentWord={suggestionsFor}
        onSelect={handleSuggestionSelected}
        onTryAgain={refetch}
      />
    </Box>
  )
}

export default AutocompleteSuggestions
