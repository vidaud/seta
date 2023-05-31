import type { AxiosError } from 'axios'

const errorInterceptor = (error: AxiosError) => {
  if (!error.response) {
    return Promise.reject(error)
  }

  const { status } = error.response

  // Redirect to login everything but '/me/user-info'

  if (error.config?.url?.includes('/me/user-info')) {
    return Promise.reject(error)
  }

  if (status === 401) {
    window.location.href = '/login?redirect=' + window.location.pathname
  }

  return Promise.reject(error)
}

export default errorInterceptor
