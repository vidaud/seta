import { Loader } from '@mantine/core'

import * as S from './styles'

const SuggestionsLoading = () => {
  return (
    <S.Container>
      <Loader color="gray" />
    </S.Container>
  )
}

export default SuggestionsLoading