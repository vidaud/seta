import { Flex, Text, TextInput } from '@mantine/core'

import * as S from './styles'

const SearchPageNew = () => {
  return (
    <Flex direction="column" align="center" css={S.pageWrapper}>
      <Text>Discover and Link Knowledge in EU Documents</Text>

      <Flex css={S.inputWrapper}>
        <TextInput
          size="md"
          className="flex-1"
          placeholder="Start typing a search term"
          autoFocus
        />
      </Flex>
    </Flex>
  )
}

export default SearchPageNew
