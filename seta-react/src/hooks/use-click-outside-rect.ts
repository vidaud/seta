import { useEffect, useRef } from 'react'

const DEFAULT_EVENTS = ['mousedown', 'touchstart']

export type CloseType =
  | 'outside-rect'
  | 'outside-rect-x'
  | 'outside-rect-y'
  | 'outside-rect-x-above'
  | 'outside-rect-x-below'

const isPointerInsideRect = (
  x: number,
  y: number,
  { left, right, top, bottom }: DOMRect,
  closeType: CloseType = 'outside-rect'
) => {
  switch (closeType) {
    case 'outside-rect':
      return x >= left && x <= right && y >= top && y <= bottom

    case 'outside-rect-x':
      return x >= left && x <= right

    case 'outside-rect-y':
      return y >= top && y <= bottom

    case 'outside-rect-x-above':
      return x >= left && x <= right && y >= top

    case 'outside-rect-x-below':
      return x >= left && x <= right && y <= bottom

    default:
      return false
  }
}

const getCoordinates = (event: Event) => {
  if (event instanceof MouseEvent) {
    return { x: event.clientX, y: event.clientY }
  }

  if (event instanceof TouchEvent) {
    const { clientX, clientY } = event.touches[0]

    return { x: clientX, y: clientY }
  }

  return { x: 0, y: 0 }
}

type Options = {
  events?: string[]
  closeType?: CloseType
  disabled?: boolean
}

/**
 * Use this hook to detect clicks outside of a given element's rect, with the option to specify the axis to ignore.
 * @param handler The callback to be run
 * @param option Options to customize the hook's behavior
 * @returns A ref to be passed to the element to be tracked
 */
const useClickOutsideRect = <T extends HTMLElement = HTMLElement>(
  handler: () => void,
  { events = DEFAULT_EVENTS, closeType = 'outside-rect', disabled }: Options = {}
) => {
  const ref = useRef<T>(null)
  const handlerRef = useRef(handler)

  useEffect(() => {
    if (disabled) {
      return
    }

    const listener = (event: Event) => {
      if (!ref.current) {
        return
      }

      const rect = ref.current.getBoundingClientRect()
      const { x, y } = getCoordinates(event)

      const { target } = event

      if (ref.current.contains(target as Node) || isPointerInsideRect(x, y, rect, closeType)) {
        return
      }

      handlerRef.current()
    }

    events.forEach(event => {
      document.addEventListener(event, listener)
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, listener)
      })
    }
  }, [ref, events, disabled, closeType])

  return ref
}

export default useClickOutsideRect
