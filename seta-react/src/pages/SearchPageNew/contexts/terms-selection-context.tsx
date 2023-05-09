import { createContext, useContext, useState } from 'react'

import type { ChildrenProp } from '~/types/children-props'

type TermsSelectionContextProps = {
  allSelected: boolean | undefined
  setAllSelected: (value: boolean | undefined) => void
}

const TermsSelectionContext = createContext<TermsSelectionContextProps | undefined>(undefined)

export const TermsSelectionProvider = ({ children }: ChildrenProp) => {
  const [allSelected, setAllSelected] = useState<boolean | undefined>(false)

  const value: TermsSelectionContextProps = {
    allSelected,
    setAllSelected
  }

  return <TermsSelectionContext.Provider value={value}>{children}</TermsSelectionContext.Provider>
}

export const useTermsSelection = () => {
  const context = useContext(TermsSelectionContext)

  if (context === undefined) {
    throw new Error('useTermsSelection must be used within a TermsSelectionProvider')
  }

  return context
}
