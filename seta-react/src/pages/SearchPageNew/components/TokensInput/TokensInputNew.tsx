import { useState } from 'react'
import type { TextInputProps } from '@mantine/core'

import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'

type Props = Omit<TextInputProps, 'onChange'> & {
  onChange?: (value: string) => void
}

const TokensInputNew = () => {
  const [focused, setFocused] = useState(false)

  const { tokens, setTokens } = useSearch()

  return <div>TokensInputNew</div>
}

export default TokensInputNew
