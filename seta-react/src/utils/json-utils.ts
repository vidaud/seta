export const serializeJSON = <T>(data: T): string => {
  try {
    return JSON.stringify(data)
  } catch (e) {
    throw new Error(`Failed to serialize JSON`)
  }
}

export const deserializeJSON = <T>(data: string): T => {
  try {
    return JSON.parse(data)
  } catch (e) {
    throw new Error(`Failed to deserialize JSON`)
  }
}
