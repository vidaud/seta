import { createContext, useCallback, useContext, useRef } from 'react'

import type { ChildrenProp } from '~/types/children-props'

type IsExpandedSetter = (isExpanded: boolean) => void

type RootActionsContextProps = {
  registerIsExpandedSetter: (id: string, setter: IsExpandedSetter) => void
  unregisterIsExpandedSetter: (id: string) => void
  collapseAllFolders: () => void
}

const RootActionsContext = createContext<RootActionsContextProps | undefined>(undefined)

export const RootActionsProvider = ({ children }: ChildrenProp) => {
  const isExpandedSettersRef = useRef(new Map<string, IsExpandedSetter>())

  const registerIsExpandedSetter: RootActionsContextProps['registerIsExpandedSetter'] = useCallback(
    (id, setter) => {
      if (!isExpandedSettersRef.current.has(id)) {
        isExpandedSettersRef.current.set(id, setter)
      }
    },
    []
  )

  const unregisterIsExpandedSetter: RootActionsContextProps['unregisterIsExpandedSetter'] =
    useCallback(id => {
      isExpandedSettersRef.current.delete(id)
    }, [])

  const collapseAllFolders: RootActionsContextProps['collapseAllFolders'] = () => {
    // Toggle all the setters to false, then clear the map
    isExpandedSettersRef.current.forEach(setter => setter(false))
    isExpandedSettersRef.current.clear()
  }

  const value: RootActionsContextProps = {
    registerIsExpandedSetter,
    unregisterIsExpandedSetter,
    collapseAllFolders
  }

  return <RootActionsContext.Provider value={value}>{children}</RootActionsContext.Provider>
}

export const useRootActions = () => {
  const context = useContext(RootActionsContext)

  if (context === undefined) {
    throw new Error('useRootActions must be used within a RootActionsProvider')
  }

  return context
}
