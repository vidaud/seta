import { useEffect, useState } from 'react'
import { Flex, Divider } from '@mantine/core'

import { useSearch } from '~/pages/SearchPageNew/contexts/search-context'
import { TermsSelectionProvider } from '~/pages/SearchPageNew/contexts/terms-selection-context'
import { TermsView } from '~/pages/SearchPageNew/types/terms-view'
import { TokenType } from '~/pages/SearchPageNew/types/token'

import useScrolled from '~/hooks/use-scrolled'

import EnrichInfo from './components/EnrichInfo'
import OntologyHeader from './components/OntologyHeader'
import OperatorInfo from './components/OperatorInfo'
import RelatedClusters from './components/RelatedClusters'
import RelatedTerms from './components/RelatedTerms'
import * as S from './styles'

type Props = {
  className?: string
  currentView?: TermsView
  enrichQuery?: boolean
  onViewChange?: (value: TermsView) => void
  onEnrichToggle?: () => void
}

const TermsSuggestions = ({
  className,
  currentView = TermsView.TermsClusters,
  enrichQuery,
  onViewChange,
  onEnrichToggle
}: Props) => {
  const [loading, setLoading] = useState(false)

  const { scrolled, setScrolled, handleScrollChange } = useScrolled({ delta: 16 })

  const { currentToken } = useSearch()

  const dividerStyle = [S.divider, scrolled && S.withShadow]
  const dividerColor = scrolled ? 'gray.3' : 'gray.2'

  const isOperator = currentToken?.type === TokenType.OPERATOR

  useEffect(() => {
    setScrolled(false)
  }, [currentView, enrichQuery, loading, setScrolled])

  const handleLoadingChange = (value: boolean) => {
    setLoading(value)
  }

  const termsView = isOperator ? (
    <OperatorInfo token={currentToken} />
  ) : enrichQuery ? (
    <EnrichInfo type={currentView} />
  ) : currentView === TermsView.TermsClusters ? (
    <RelatedClusters
      onLoadingChange={handleLoadingChange}
      onScrollPositionChange={handleScrollChange}
    />
  ) : (
    <RelatedTerms onLoadingChange={handleLoadingChange} />
  )

  return (
    <TermsSelectionProvider>
      <Flex className={className} direction="column">
        <OntologyHeader
          currentView={currentView}
          enrichQuery={enrichQuery}
          loading={loading}
          onViewChange={onViewChange}
          onEnrichToggle={onEnrichToggle}
        />

        <Divider color={dividerColor} css={dividerStyle} />

        {termsView}
      </Flex>
    </TermsSelectionProvider>
  )
}

export default TermsSuggestions
