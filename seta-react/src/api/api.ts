import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import axios from '~/libs/axios'

const api = {
  get: <R>(path: string, config?: AxiosRequestConfig<unknown>): Promise<AxiosResponse<R>> =>
    axios.get<unknown, AxiosResponse<R>>(path, config),

  post: <R, D = unknown>(
    path: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<AxiosResponse<R>> => axios.post<unknown, AxiosResponse<R>, D>(path, data, config),

  put: <R, D>(path: string, data: D, config?: AxiosRequestConfig<D>): Promise<AxiosResponse<R>> =>
    axios.put<unknown, AxiosResponse<R>, D>(path, data, config),

  delete: <R>(path: string, config?: AxiosRequestConfig<unknown>): Promise<AxiosResponse<R>> =>
    axios.delete<unknown, AxiosResponse<R>>(path, config)
}

export default api
