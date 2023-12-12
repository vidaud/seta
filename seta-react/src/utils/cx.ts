type Value = string | boolean | undefined | null
type Mapping = Record<string, Value>
type Argument = Value | Mapping | Argument[]

/**
 * A utility function to concatenate class names conditionally
 * @param args - The class names to concatenate
 * @returns The concatenated class names
 */
const cx = (...args: Argument[]) => {
  const classNames: string[] = []

  args.forEach(arg => {
    if (typeof arg === 'string') {
      classNames.push(arg)

      return
    }

    if (!arg || typeof arg !== 'object') {
      return
    }

    if (Array.isArray(arg)) {
      classNames.push(cx(...arg))
    } else {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          classNames.push(key)
        }
      })
    }
  })

  return classNames.filter(Boolean).join(' ')
}

export default cx
