import { createContext, useContext, useState } from 'react'

export interface DatasourceListContextValue {
  selected?: string
  handleSearchableChange: (value) => void
}

export const DatasourceContext = createContext<DatasourceListContextValue | undefined>(undefined)

export const DatasourceListProvider = ({ children }) => {
  const [selected, setSelected] = useState<string | undefined>('all')

  const handleSearchableChange = value => {
    setSelected(value)
  }

  const values: DatasourceListContextValue | undefined = {
    selected: selected,
    handleSearchableChange: handleSearchableChange
  }

  return <DatasourceContext.Provider value={values}>{children}</DatasourceContext.Provider>
}

export const useDatasourceListContext = () => {
  const context = useContext(DatasourceContext)

  if (context === undefined) {
    throw new Error('useDatasourceListContext must be used within a DatasourceListProvider')
  }

  return context
}
