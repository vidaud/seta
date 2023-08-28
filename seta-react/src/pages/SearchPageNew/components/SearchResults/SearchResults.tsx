import type { ReactElement } from 'react'
import { Box } from '@mantine/core'

import * as S from './styles'

import SearchResultsTabs from '../SearchResultsTabs'

type Props = {
  children: ReactElement
}

const SearchResults = ({ children }: Props) => {
  return (
    <Box css={S.root} mt="2rem">
      <SearchResultsTabs>{children}</SearchResultsTabs>
    </Box>
  )
}

export default SearchResults
