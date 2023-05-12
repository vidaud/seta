import type { AxiosResponse } from 'axios'
import axios from 'axios'

import { environment } from '../../environments/environment'

const API_ROOT = environment.community_api_target_path.replace(/\/+$/, '')

const community_apiRoute = (path: string): string => `${API_ROOT}${path}`

const community_api = {
  get: <R>(path: string): Promise<AxiosResponse<R>> =>
    axios.get<unknown, AxiosResponse<R>>(community_apiRoute(path)),

  post: <R, T = unknown>(path: string, data?: T, options?): Promise<AxiosResponse<R>> =>
    axios.post<T, AxiosResponse<R>>(community_apiRoute(path), data, options),

  put: <R, T>(path: string, data: T, options?): Promise<AxiosResponse<R>> =>
    axios.put<T, AxiosResponse<R>>(community_apiRoute(path), data, options),

  delete: <R>(path: string, options): Promise<AxiosResponse<R>> =>
    axios.delete<unknown, AxiosResponse<R>>(community_apiRoute(path), options)
}

export default community_api
