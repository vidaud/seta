import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

import { environment } from '~/environments/environment'

const API_ROOT = environment.api_target_path.replace(/\/+$/, '')

const apiRoute = (path: string): string => `${API_ROOT}${path}`

const api = {
  get: <R>(path: string, config?: AxiosRequestConfig<unknown>): Promise<AxiosResponse<R>> =>
    axios.get<unknown, AxiosResponse<R>>(apiRoute(path), config),

  post: <R, D = unknown>(
    path: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<AxiosResponse<R>> =>
    axios.post<unknown, AxiosResponse<R>, D>(apiRoute(path), data, config),

  put: <R, D>(path: string, data: D, config?: AxiosRequestConfig<D>): Promise<AxiosResponse<R>> =>
    axios.put<unknown, AxiosResponse<R>, D>(apiRoute(path), data, config),

  delete: <R>(path: string, config?: AxiosRequestConfig<unknown>): Promise<AxiosResponse<R>> =>
    axios.delete<unknown, AxiosResponse<R>>(apiRoute(path), config)
}

export default api
