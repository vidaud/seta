import { Flex } from '@mantine/core'

import { useSuggestions } from '~/api/search/suggestions'

import SearchSuggestionInput from './components/SearchSuggestionInput'
import * as S from './styles'

const SearchPageNew = () => {
  const { data } = useSuggestions('test')

  console.log(data?.words)

  return (
    <Flex direction="column" align="center" css={S.pageWrapper}>
      <SearchSuggestionInput />
    </Flex>
  )
}

export default SearchPageNew
