import { deserializeJSON, serializeJSON } from '~/utils/json-utils'

export const storage = <T>(key: string, initialValue?: T) => {
  const read = (): T | null => {
    const data = localStorage.getItem(key)

    if (data === null) {
      return null
    }

    return deserializeJSON<T>(data)
  }

  const write = (data: T): T => {
    localStorage.setItem(key, serializeJSON(data))

    return data
  }

  const remove = (reset?: boolean): void => {
    if (reset && initialValue) {
      write(initialValue)
    } else {
      localStorage.removeItem(key)
    }
  }

  if (initialValue) {
    const exists = localStorage.getItem(key) !== null

    if (!exists) {
      write(initialValue)
    }
  }

  return { read, write, remove }
}
