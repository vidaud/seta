export const omit = (obj, omitKey) => {
  return Object?.keys(obj)?.reduce((result, key) => {
    if (key !== omitKey) {
      result[key] = obj[key]
    }

    return result
  }, {})
}
