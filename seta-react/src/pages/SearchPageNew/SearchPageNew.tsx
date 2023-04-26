import { Flex } from '@mantine/core'

import SearchSuggestionInput from './components/SearchSuggestionInput'
import * as S from './styles'

const SearchPageNew = () => {
  return (
    <Flex direction="column" align="center" css={S.pageWrapper}>
      <SearchSuggestionInput />
    </Flex>
  )
}

export default SearchPageNew
