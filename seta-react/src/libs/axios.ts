import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { getCookie } from 'typescript-cookie'

import { environment } from '~/environments/environment'
import errorInterceptor from '~/libs/axios-error-interceptor'
import { logResponse } from '~/libs/axios-logger'
import { paramsSerializer } from '~/utils/api-utils'

const API_ROOT = environment.searchApiRoot

export const axiosConfig: AxiosRequestConfig = {
  baseURL: API_ROOT,
  paramsSerializer: { serialize: paramsSerializer }
}

const instance = axios.create(axiosConfig)

instance.interceptors.request.use(config => {
  config.startTime = new Date().getTime()

  //add cross-domain reference token for each request, if exists
  const csrf_token = getCookie('csrf_access_token')

  if (csrf_token) {
    config.headers['X-CSRF-TOKEN'] = csrf_token
  }

  return config
})

instance.interceptors.response.use(response => {
  logResponse(response)

  return response
}, errorInterceptor)

export default instance
