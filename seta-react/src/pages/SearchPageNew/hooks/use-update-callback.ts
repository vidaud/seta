import { useEffect, useRef } from 'react'

/**
 * Saves the `callback` to a ref and calls it with `value` whenever `value` changes.
 *
 * **Important:** The `callback` will not be updated if it changes, so use this hook carefully.
 * @param callback The callback to call with `value`
 * @param value The value to pass to `callback`
 */
const useUpdateCallback = <T>(callback: ((value: T) => void) | undefined, value: T) => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current?.(value)
  }, [value])
}

export default useUpdateCallback
