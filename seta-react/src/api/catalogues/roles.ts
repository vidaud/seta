import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { environment } from '~/environments/environment'
import type { CatalogueRole, RolesCatalogue, RoleCategory } from '~/types/catalogue/catalogue-roles'

import api from '../api'

const ROLES_API_PATH = '/catalogue/roles'

export const cacheKey = (category?: RoleCategory) => [ROLES_API_PATH, category]

const getCatalogueRoles = async (config?: AxiosRequestConfig): Promise<RolesCatalogue> => {
  const { data } = await api.get<RolesCatalogue>(ROLES_API_PATH, {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useCatalogueRoles = () =>
  useQuery({ queryKey: cacheKey(), queryFn: ({ signal }) => getCatalogueRoles({ signal }) })

const getCategoryCatalogueRoles = async (
  category?: RoleCategory,
  config?: AxiosRequestConfig
): Promise<CatalogueRole[]> => {
  const { data } = await api.get<CatalogueRole[]>(`${ROLES_API_PATH}/${category}`, {
    baseURL: environment.baseUrl,
    ...config
  })

  return data
}

export const useCategoryCatalogueRoles = (category?: RoleCategory) =>
  useQuery({
    queryKey: cacheKey(category),
    queryFn: ({ signal }) => getCategoryCatalogueRoles(category, { signal })
  })
