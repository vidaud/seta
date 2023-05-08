import { useSearch } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-context'
import { useSearchInput } from '~/pages/SearchPageNew/components/SuggestionsPopup/contexts/search-input-context'

import { useRelatedTerms } from '~/api/search/related-terms'

import TermClustersContent from './TermClustersContent'

const OntologyTerms = () => {
  // const [allSelected, setAllSelected] = useState<boolean | undefined>(undefined)

  const { onSelectedTermsAdd, onSelectedTermsRemove, currentToken } = useSearch()
  const { input, setPosition } = useSearchInput()

  const searchTerm = currentToken?.rawValue

  const { data, isLoading, error, refetch } = useRelatedTerms(searchTerm)

  const focusInput = () => {
    if (!currentToken) {
      return
    }

    // input?.blur()

    setTimeout(() => {
      input?.focus()
      setPosition(currentToken.index + currentToken.token.length)
    }, 200)
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
    <TermClustersContent
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

export default OntologyTerms
