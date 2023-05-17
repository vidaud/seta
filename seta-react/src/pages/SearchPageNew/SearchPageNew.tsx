import { Flex } from '@mantine/core'

import SearchSuggestionInput from './components/SearchSuggestionInput'
import * as S from './styles'

const SearchPageNew = () => {
  const handleSearch = (value: string) => {
    console.log(value)
  }

  return (
    <Flex direction="column" align="center" css={S.pageWrapper}>
      <SearchSuggestionInput onSearch={handleSearch} />
    </Flex>
  )
}

export default SearchPageNew
