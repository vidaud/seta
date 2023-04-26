import { Box } from '@mantine/core'

import ListMenu from '~/components/ListMenu'

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
  const { onSuggestionSelected } = useSearch()

  return (
    <Box className={className} css={S.root}>
      <ListMenu items={terms} onSelect={onSuggestionSelected} />
    </Box>
  )
}

export default AutocompleteSuggestions
