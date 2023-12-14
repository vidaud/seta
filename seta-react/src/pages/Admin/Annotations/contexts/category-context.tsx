import { createContext, useContext, useEffect, useState } from 'react'

import { useAnnotationCategories } from '~/api/admin/annotation_categories'

export interface CategoryContextValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories?: any
}

export const CategoryContext = createContext<CategoryContextValue | undefined>(undefined)

export const CategoryProvider = ({ children }) => {
  const { data } = useAnnotationCategories()
  const [categories, setCategories] = useState(data)

  useEffect(() => {
    if (data) {
      setCategories(data)
    }
  }, [data])

  const values: CategoryContextValue | undefined = {
    categories: categories
  }

  return <CategoryContext.Provider value={values}>{children}</CategoryContext.Provider>
}

export const useCategoryContext = () => {
  const context = useContext(CategoryContext)

  if (context === undefined) {
    throw new Error('useCategoryContext must be used within a CategoryProvider')
  }

  return context
}
