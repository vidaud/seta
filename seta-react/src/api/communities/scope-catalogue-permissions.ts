import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { environment } from '~/environments/environment'

import api from '../api'
import type { CatalogueScopesResponse, CategoryScopesResponse } from '../types/catalogue-scopes'

const SCOPES_API_PATH = '/catalogue/scopes'

export const cacheKey = (category?: string) => ['/catalogue/scopes', category]
const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

export const getCatalogueScopes = async (): Promise<CatalogueScopesResponse[]> => {
  const { data } = await api.get<CatalogueScopesResponse[]>(`${SCOPES_API_PATH}`, apiConfig)

  return data
}

export const useCatalogueScopes = () =>
  useQuery({ queryKey: cacheKey(), queryFn: () => getCatalogueScopes() })

export const getCategoryCatalogueScopes = async (
  category?: string
): Promise<CategoryScopesResponse[]> => {
  const { data } = await api.get<CategoryScopesResponse[]>(
    `${SCOPES_API_PATH}/${category}`,
    apiConfig
  )

  return data
}

export const useCategoryCatalogueScopes = (category?: string) =>
  useQuery({ queryKey: cacheKey(category), queryFn: () => getCategoryCatalogueScopes(category) })
