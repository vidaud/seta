import type { CustomParamsSerializer } from 'axios'

export const paramsSerializer: CustomParamsSerializer = params => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      searchParams.append(key, value.join(','))
    } else {
      searchParams.append(key, value)
    }
  })

  return searchParams.toString()
}
