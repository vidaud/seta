import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { environment } from '~/environments/environment'
import type {
  CatalogueScopesResponse,
  CategoryScopesResponse,
  ScopeCategory
} from '~/types/catalogue/catalogue-scopes'

import api from '../api'

const SCOPES_API_PATH = '/catalogue/scopes'

export const cacheKey = (category?: ScopeCategory) => [SCOPES_API_PATH, category]

const getCatalogueScopes = async (
  config?: AxiosRequestConfig
): Promise<CatalogueScopesResponse> => {
  const { data } = await api.get<CatalogueScopesResponse>(SCOPES_API_PATH, {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useCatalogueScopes = () =>
  useQuery({ queryKey: cacheKey(), queryFn: ({ signal }) => getCatalogueScopes({ signal }) })

const getCategoryCatalogueScopes = async (
  category?: ScopeCategory,
  config?: AxiosRequestConfig
): Promise<CategoryScopesResponse[]> => {
  const { data } = await api.get<CategoryScopesResponse[]>(`${SCOPES_API_PATH}/${category}`, {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useCategoryCatalogueScopes = (category?: ScopeCategory) =>
  useQuery({
    queryKey: cacheKey(category),
    queryFn: ({ signal }) => getCategoryCatalogueScopes(category, { signal })
  })
