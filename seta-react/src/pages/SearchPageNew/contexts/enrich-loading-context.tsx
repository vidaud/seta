import { createContext, useContext } from 'react'

import type { ChildrenProp } from '~/types/children-props'

type EnrichLoadingContextProps = {
  loading: boolean
}

const EnrichLoadingContext = createContext<EnrichLoadingContextProps | undefined>(undefined)

export const EnrichLoadingProvider = ({
  loading,
  children
}: EnrichLoadingContextProps & ChildrenProp) => {
  const value: EnrichLoadingContextProps = {
    loading
  }

  return <EnrichLoadingContext.Provider value={value}>{children}</EnrichLoadingContext.Provider>
}

export const useEnrichLoading = () => {
  const context = useContext(EnrichLoadingContext)

  if (!context) {
    throw new Error('useEnrichLoading must be used within an EnrichLoadingProvider')
  }

  return context
}
