import { useQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

import { environment } from '~/environments/environment'

import { AuthenticatorsQueryKeys } from './query-keys'

import api from '../api'

const AUTHENTICATORS_API_PATH = '/authenticators'

type AUTHENTICATORS = {
  name: string
  login_url: string
  logout_url: string
}

const getThirdPartyAuthenticators = async (
  config?: AxiosRequestConfig
): Promise<AUTHENTICATORS[]> => {
  const { data } = await api.get<AUTHENTICATORS[]>(AUTHENTICATORS_API_PATH, {
    baseURL: environment.authenticationUrl,
    ...config
  })

  return data
}

export const useThirdPartyAuthenticators = () => {
  return useQuery({
    queryKey: AuthenticatorsQueryKeys.AuthenticatorsKeys,
    queryFn: ({ signal }) => getThirdPartyAuthenticators({ signal })
  })
}
