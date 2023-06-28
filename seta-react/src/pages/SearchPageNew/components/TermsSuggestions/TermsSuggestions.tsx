import { useEffect, useState } from 'react'
import { Flex, Divider } from '@mantine/core'

import { TermsSelectionProvider } from '~/pages/SearchPageNew/contexts/terms-selection-context'
import { TermsView } from '~/pages/SearchPageNew/types/terms-view'

import EnrichInfo from './components/EnrichInfo'
import OntologyHeader from './components/OntologyHeader'
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
  const [scrolled, setScrolled] = useState(false)

  const dividerStyle = [S.divider, scrolled && S.withShadow]
  const dividerColor = scrolled ? 'gray.3' : 'gray.2'

  useEffect(() => {
    setScrolled(false)
  }, [currentView, enrichQuery, loading])

  const handleLoadingChange = (value: boolean) => {
    setLoading(value)
  }

  const termsView = enrichQuery ? (
    <EnrichInfo type={currentView} />
  ) : currentView === TermsView.TermsClusters ? (
    <RelatedClusters
      onLoadingChange={handleLoadingChange}
      onScrollPositionChange={({ y }) => setScrolled(y > 16)}
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
