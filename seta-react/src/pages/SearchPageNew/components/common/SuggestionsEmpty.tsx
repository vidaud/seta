import { Text } from '@mantine/core'

import * as S from './styles'

type Props = {
  message?: string
}

const SuggestionsEmpty = ({ message }: Props) => {
  return (
    <S.Container>
      <Text fz="sm" color="gray.6">
        {message ?? 'No results'}
      </Text>
    </S.Container>
  )
}

export default SuggestionsEmpty