import { useQuery } from '@tanstack/react-query'

import community_api from './api'

import type { CatalogueScopesResponse, CategoryScopesResponse } from '../types/catalogue-scopes'

const SCOPES_API_PATH = '/catalogue/scopes'

export const cacheKey = (category?: string) => ['/catalogue/scopes', category]

export const getCatalogueScopes = async (): Promise<CatalogueScopesResponse[]> => {
  const { data } = await community_api.get<CatalogueScopesResponse[]>(`${SCOPES_API_PATH}`)

  return data
}

export const useCatalogueScopes = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getCatalogueScopes() })

export const getCategoryCatalogueScopes = async (
  category?: string
): Promise<CategoryScopesResponse[]> => {
  const { data } = await community_api.get<CategoryScopesResponse[]>(
    `${SCOPES_API_PATH}/${category}`
  )

  return data
}

export const useCategoryCatalogueScopes = (category?: string) =>
  useQuery({ queryKey: cacheKey(category), queryFn: () => getCategoryCatalogueScopes(category) })
