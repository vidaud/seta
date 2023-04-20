import { useState } from 'react'
import { css } from '@emotion/react'
import { Flex } from '@mantine/core'

import TokensInput from '~/pages/SearchPageNew/components/TokensInput/TokensInput'

import SearchInput from './components/SearchInput'
import SuggestionsPopup from './components/SuggestionsPopup'
import * as S from './styles'

const SearchPageNew = () => {
  const [suggestionOpen, setSuggestionOpen] = useState(false)

  const openPopup = () => setSuggestionOpen(true)

  return (
    <Flex direction="column" align="center" css={S.pageWrapper}>
      <TokensInput
        css={css`
          width: 600px;
        `}
      />

      <SuggestionsPopup opened={suggestionOpen} onChange={setSuggestionOpen}>
        <SearchInput css={S.inputWrapper} onClick={openPopup} onChange={openPopup} />
      </SuggestionsPopup>
    </Flex>
  )
}

export default SearchPageNew
