import type { InternalAxiosRequestConfig } from 'axios'
import axios, { AxiosError } from 'axios'

import { environment } from '~/environments/environment'
import logger from '~/utils/logger'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class SetaAxiosError<T = unknown, D = any> extends AxiosError<T, D> {
  config?: InternalAxiosRequestConfig<D> & { _retry?: boolean }
}

const errorInterceptor = async (error: SetaAxiosError) => {
  if (!error.response) {
    return Promise.reject(error)
  }

  const originalRequest = error.config
  const { status } = error.response

  // Redirect to login everything but '/user-info'
  //? /notifications should prevent refresh mechanism
  // /rsa-key accepts only fresh tokens

  const fresh_endpoints: RegExp[] = [
    /\/me\/rsa-key[/]?$/,
    /\/me\/auth-key[/]?$/,
    /\/me\/apps$/,
    /\/me\/apps\/.*/,
    /\/me\/permissions$/
  ]

  const redirectEndpoint = (url: string | undefined) => {
    if (!url) {
      return true
    }

    return fresh_endpoints.find(item => item.test(url))
  }

  if (
    originalRequest?.url?.includes('/user-info') ||
    originalRequest?.url?.includes('/notifications')
  ) {
    return Promise.reject(error)
  }

  if (status === 401) {
    if (!originalRequest || originalRequest?._retry || redirectEndpoint(originalRequest?.url)) {
      window.location.href = '/login?redirect=' + window.location.pathname
    } else {
      originalRequest._retry = true

      await axios({
        method: 'POST',
        url: '/refresh',
        headers: { 'Content-Type': 'application/json' },
        baseURL: environment.authenticationUrl
      }).catch(function (err) {
        logger.error(err)

        window.location.href = '/login?redirect=' + window.location.pathname
      })

      logger.log(`Refreshed tokens for ${originalRequest.url}`)

      return Promise.resolve(axios.request(originalRequest))
    }
  }

  return Promise.reject(error)
}

export default errorInterceptor
