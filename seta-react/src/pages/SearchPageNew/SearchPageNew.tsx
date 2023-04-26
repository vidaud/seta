import { Flex } from '@mantine/core'

import SuggestionsPopup from './components/SuggestionsPopup'
import * as S from './styles'

const SearchPageNew = () => {
  return (
    <Flex direction="column" align="center" css={S.pageWrapper}>
      <SuggestionsPopup />
    </Flex>
  )
}

export default SearchPageNew
