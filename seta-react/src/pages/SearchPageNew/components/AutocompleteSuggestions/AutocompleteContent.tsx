import { Anchor, Loader, Text } from '@mantine/core'

import type { ListMenuProps } from '~/components/ListMenu'
import ListMenu from '~/components/ListMenu'

import type { SuggestionsResponse } from '~/api/search/suggestions'
import type { DataProps } from '~/types/data-props'

import * as S from './styles'

type Props = Omit<ListMenuProps, 'items'> & {
  hasSearchTerm: boolean
} & DataProps<SuggestionsResponse>

const AutocompleteContent = ({
  hasSearchTerm,
  data,
  isLoading,
  error,
  onTryAgain,
  ...props
}: Props) => {
  if (error) {
    return (
      <S.Container>
        <Text fz="sm" color="red.6">
          There was an error fetching suggestions.
          <br />
          Please <Anchor onClick={onTryAgain}>try again</Anchor>.
        </Text>
      </S.Container>
    )
  }

  if (isLoading || !data) {
    return (
      <S.Container>
        <Loader color="gray" />
      </S.Container>
    )
  }

  const info = hasSearchTerm ? 'No suggestions' : 'Start typing to see suggestions'

  if (!data.words.length) {
    return (
      <S.Container>
        <Text fz="sm" color="gray.6">
          {info}
        </Text>
      </S.Container>
    )
  }

  const suggestions = data.words

  return <ListMenu items={suggestions} {...props} />
}

export default AutocompleteContent
