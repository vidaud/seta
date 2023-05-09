import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'
import { useSearchInput } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-input-context'

import { useRelatedClusters } from '~/api/search/related-clusters'

import RelatedClustersContent from './RelatedClustersContent'

const RelatedClusters = () => {
  // const [allSelected, setAllSelected] = useState<boolean | undefined>(undefined)

  const { onSelectedTermsAdd, onSelectedTermsRemove, currentToken } = useSearch()
  const { setPositionDelayed } = useSearchInput()

  const searchTerm = currentToken?.rawValue

  const { data, isLoading, error, refetch } = useRelatedClusters(searchTerm)

  const focusInput = () => {
    if (!currentToken) {
      return
    }

    setPositionDelayed(currentToken.index + currentToken.token.length, 200)
  }

  const handleSelectedTermsAdd = (terms: string[]) => {
    onSelectedTermsAdd(terms)
    focusInput()
  }

  const handleSelectedTermsRemove = (terms: string[]) => {
    onSelectedTermsRemove(terms)
    focusInput()
  }

  return (
    <RelatedClustersContent
      data={data}
      isLoading={isLoading}
      error={error}
      onTryAgain={refetch}
      // allSelected={allSelected}
      onSelectedTermsAdd={handleSelectedTermsAdd}
      onSelectedTermsRemove={handleSelectedTermsRemove}
    />
  )
}

export default RelatedClusters
