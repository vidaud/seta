/**
 * Returns the value if it is greater than the minimum value, otherwise returns the minimum value
 * @param value The value to check
 * @param minValue The minimum value
 */
const useMinValue = (value: number, minValue: number) => (value < minValue ? minValue : value)

export default useMinValue
