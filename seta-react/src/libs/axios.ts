import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

import { environment } from '~/environments/environment'
import errorInterceptor from '~/libs/axios-error-interceptor'
import { logResponse } from '~/libs/axios-logger'
import { paramsSerializer } from '~/utils/api-utils'

const API_ROOT = environment.api_target_path.replace(/\/+$/, '')

export const axiosConfig: AxiosRequestConfig = {
  baseURL: API_ROOT,
  paramsSerializer: { serialize: paramsSerializer }
}

const instance = axios.create(axiosConfig)

instance.interceptors.request.use(config => {
  config.startTime = new Date().getTime()

  return config
})

instance.interceptors.response.use(response => {
  logResponse(response)

  return response
}, errorInterceptor)

export default instance
