const isObject = (value: unknown) => value && typeof value === 'object'

const getIdValue = <T>(value: T, idProp: keyof T | undefined) => {
  if (isObject(value) && idProp) {
    return value[idProp]
  }

  return value
}

/**
 * Toggles a value in an array.
 * @param array The array to toggle the value in.
 * @param value The value to toggle.
 * @param toggledOn Whether to toggle the value on or off.
 * @param idProp The property to use as the ID when comparing objects.
 * @returns A new instance of the array with the value toggled on or off.
 */
export const toggleArrayValue = <T>(array: T[], value: T, toggledOn: boolean, idProp?: keyof T) => {
  const idOrValue = getIdValue(value, idProp)

  if (toggledOn) {
    if (array.some(item => getIdValue(item, idProp) === idOrValue)) {
      return array
    }

    return [...array, value]
  }

  return array.filter(item => getIdValue(item, idProp) !== idOrValue)
}
