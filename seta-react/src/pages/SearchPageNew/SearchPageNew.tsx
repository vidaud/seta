import { useState } from 'react'
import { Flex, Text } from '@mantine/core'

import SearchInput from './components/SearchInput'
import SuggestionsPopup from './components/SuggestionsPopup'
import * as S from './styles'

const SearchPageNew = () => {
  const [suggestionOpen, setSuggestionOpen] = useState(false)

  return (
    <Flex direction="column" align="center" css={S.pageWrapper}>
      <Text>Discover and Link Knowledge in EU Documents</Text>

      <SuggestionsPopup opened={suggestionOpen} onChange={setSuggestionOpen}>
        <SearchInput css={S.inputWrapper} onChange={() => setSuggestionOpen(true)} />
      </SuggestionsPopup>
    </Flex>
  )
}

export default SearchPageNew
