import { Flex, Divider } from '@mantine/core'

import OntologyHeader from '~/pages/SearchPageNew/components/OntologyHeader'
import TermClusters from '~/pages/SearchPageNew/components/TermClusters'
import { TermsView } from '~/pages/SearchPageNew/types/terms-view'

type Props = {
  className?: string
  currentView?: TermsView
  onViewChange?: (value: TermsView) => void
}

const TermsSuggestions = ({ className, currentView, onViewChange }: Props) => {
  const termsView =
    currentView === TermsView.TermsClusters ? <TermClusters /> : <div>Related Terms</div>

  return (
    <Flex className={className} direction="column">
      <OntologyHeader currentView={currentView} onViewChange={onViewChange} />
      <Divider color="gray.2" />

      {termsView}
    </Flex>
  )
}

export default TermsSuggestions
