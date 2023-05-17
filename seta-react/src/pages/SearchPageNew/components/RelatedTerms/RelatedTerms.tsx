import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'
import { useSearchInput } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-input-context'

import { useRelatedTerms } from '~/api/search/related-terms'

import RelatedTermsContent from './RelatedTermsContent'

const RelatedTerms = () => {
  const { onSelectedTermsAdd, onSelectedTermsRemove, currentToken } = useSearch()
  const { setPositionDelayed } = useSearchInput()

  const searchTerm = currentToken?.rawValue

  const { data, isLoading, error, refetch } = useRelatedTerms(searchTerm)

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
    <RelatedTermsContent
      data={data}
      isLoading={isLoading}
      error={error}
      onTryAgain={refetch}
      onSelectedTermsAdd={handleSelectedTermsAdd}
      onSelectedTermsRemove={handleSelectedTermsRemove}
    />
  )
}

export default RelatedTerms
