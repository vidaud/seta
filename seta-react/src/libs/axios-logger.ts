import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// We're using console.log() to log the request and response in the browser console.
// eslint-disable-next-line no-console
const log = console.log

const dontLog = !import.meta.env.DEV || import.meta.env.VITE_API_DISABLE_LOGGER === 'true'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

const green = '#15803D'
const orange = '#F97316'
const red = '#cc0606'
const brown = '#9D4E00'
const purple = '#7928CA'
const blue = '#0070F3'

const COLORS = {
  gray: '#555',
  gray2: '#777',
  gray3: '#999',
  green,
  brown,
  red,
  orange,
  purple,
  blue,

  GET: green,
  POST: blue,
  PUT: orange,
  DELETE: red,
  PATCH: orange
}

const color = (key: keyof typeof COLORS) => `color: ${COLORS[key]}`

export const logRequest = (config: AxiosRequestConfig) => {
  if (dontLog) {
    return
  }

  const { url, method } = config
  const methodValue = method?.toUpperCase() ?? 'GET'

  log(`%c${methodValue} %c${url}`, color('gray3'), color('gray2'))
}

export const logResponse = (response: AxiosResponse) => {
  if (dontLog) {
    return
  }

  const { status, statusText, config, data } = response
  const { method, startTime, url } = config ?? {}

  const methodValue = (method?.toUpperCase() ?? 'GET') as Method

  const duration = startTime ? new Date().getTime() - startTime : 0
  const roundedSeconds = Math.round(duration / 10) / 100
  const durationFormatted = duration >= 1000 ? `${roundedSeconds}s` : `${duration}ms`

  log(
    `%c${methodValue} %c${url} %c${status} ${statusText} %c${durationFormatted}  `,
    color(methodValue),
    color('gray'),
    color(status >= 300 ? 'brown' : 'green'),
    color(duration >= 500 ? 'red' : duration >= 200 ? 'orange' : 'purple'),
    data
  )
}
