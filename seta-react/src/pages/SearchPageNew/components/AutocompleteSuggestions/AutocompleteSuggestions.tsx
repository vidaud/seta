import { Box } from '@mantine/core'

import ListMenu from '~/components/ListMenu'
import { useSearchInput } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-input-context'

import * as S from './styles'

import { useSearch } from '../SuggestionsPopup/contexts/search-context'

const terms: string[] = [
  'test',
  'testing',
  'tests',
  'tested',
  'test rigs',
  'test programme',
  'tested materials',
  'test facility',
  'test purposes',
  'test surfaces',
  'technology gmbh',
  'text',
  'temperature',
  'temperat',
  'tem',
  'temperature level',
  'temperature differences',
  'tends'
]

type Props = {
  className?: string
}

const AutocompleteSuggestions = ({ className }: Props) => {
  const { onSuggestionSelected, currentToken } = useSearch()
  const { input, setPosition } = useSearchInput()

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
    <Box className={className} css={S.root}>
      <ListMenu
        items={terms}
        currentWord={currentToken?.word}
        onSelect={handleSuggestionSelected}
      />
    </Box>
  )
}

export default AutocompleteSuggestions
