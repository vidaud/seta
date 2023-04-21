import { useState } from 'react'
import { Flex } from '@mantine/core'

import SearchInput from './components/SearchInput'
import SuggestionsPopup from './components/SuggestionsPopup'
import * as S from './styles'

const SearchPageNew = () => {
  const [suggestionOpen, setSuggestionOpen] = useState(false)

  const openPopup = () => setSuggestionOpen(true)

  return (
    <Flex direction="column" align="center" css={S.pageWrapper}>
      <SuggestionsPopup opened={suggestionOpen} onChange={setSuggestionOpen}>
        <SearchInput css={S.inputWrapper} onClick={openPopup} onChange={openPopup} />
      </SuggestionsPopup>
    </Flex>
  )
}

export default SearchPageNew
