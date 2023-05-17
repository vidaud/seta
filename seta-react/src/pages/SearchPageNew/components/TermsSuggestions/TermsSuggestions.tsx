import { useState } from 'react'
import { Flex, Divider } from '@mantine/core'

import { TermsSelectionProvider } from '~/pages/SearchPageNew/contexts/terms-selection-context'
import { TermsView } from '~/pages/SearchPageNew/types/terms-view'

import EnrichInfo from './components/EnrichInfo'
import OntologyHeader from './components/OntologyHeader'
import RelatedClusters from './components/RelatedClusters'
import RelatedTerms from './components/RelatedTerms'

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

  const handleLoadingChange = (value: boolean) => {
    setLoading(value)
  }

  const termsView = enrichQuery ? (
    <EnrichInfo type={currentView} />
  ) : currentView === TermsView.TermsClusters ? (
    <RelatedClusters onLoadingChange={handleLoadingChange} />
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

        <Divider color="gray.2" />

        {termsView}
      </Flex>
    </TermsSelectionProvider>
  )
}

export default TermsSuggestions
