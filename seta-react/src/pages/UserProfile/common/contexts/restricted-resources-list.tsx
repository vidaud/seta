import { createContext, useContext, useState } from 'react'

export interface RestrictedResourcesListContextValue {
  opened?: boolean
  handleOpened: (value) => void
}

export const RestrictedResourcesListContext = createContext<
  RestrictedResourcesListContextValue | undefined
>(undefined)

export const RestrictedResourcesListProvider = ({ children }) => {
  const [opened, setOpened] = useState(false)

  const handleOpened = value => {
    setOpened(value)
  }

  const values: RestrictedResourcesListContextValue | undefined = {
    opened: opened,
    handleOpened: handleOpened
  }

  return (
    <RestrictedResourcesListContext.Provider value={values}>
      {children}
    </RestrictedResourcesListContext.Provider>
  )
}

export const useRestrictedResourcesListContext = () => {
  const context = useContext(RestrictedResourcesListContext)

  if (context === undefined) {
    throw new Error(
      'useRestrictedResourcesListContext must be used within a RestrictedResourcesListProvider'
    )
  }

  return context
}
