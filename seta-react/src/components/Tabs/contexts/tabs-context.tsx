import { createContext, useContext } from 'react'

import type { PropsWithChildren } from '~/types/children-props'

type CurrentTabContextProps = {
  value: string | null
}

const CurrentTabContext = createContext<CurrentTabContextProps | undefined>(undefined)

export const CurrentTabProvider = ({
  value,
  children
}: PropsWithChildren<CurrentTabContextProps>) => (
  <CurrentTabContext.Provider value={{ value }}>{children}</CurrentTabContext.Provider>
)

export const useCurrentTab = () => {
  const context = useContext(CurrentTabContext)

  if (context === undefined) {
    throw new Error('useCurrentTab must be used within a CurrentTabProvider')
  }

  return context.value
}
