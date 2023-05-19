import type { InternalAxiosRequestConfig as AxiosInternalRequestConfig } from 'axios'

declare module 'axios' {
  export interface InternalAxiosRequestConfig extends AxiosInternalRequestConfig {
    startTime?: number
  }
}
