import { Flex } from '@mantine/core'
import { FaHatWizard } from 'react-icons/fa'

import { TermsView } from '~/pages/SearchPageNew/types/terms-view'

import * as S from './styles'

type Props = {
  type: TermsView
}

const EnrichInfo = ({ type }: Props) => {
  const what = type === TermsView.TermsClusters ? 'terms in the related clusters' : 'related terms'

  return (
    <Flex align="center" justify="center" css={S.root}>
      <Flex align="center" justify="center" css={S.container}>
        <div css={S.icon}>
          <FaHatWizard size={64} />
        </div>
        <div css={S.content}>
          <div>This search is enriched automatically.</div>
          <div>Every term is expanded in the background to include all the {what}.</div>
        </div>
      </Flex>
    </Flex>
  )
}

export default EnrichInfo
