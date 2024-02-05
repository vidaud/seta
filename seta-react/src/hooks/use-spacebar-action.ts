import type { KeyboardEvent, MouseEvent } from 'react'

// `e` is a `MouseEvent` so that we can directly pass a click handler to this hook
const useKeyboardAction = <T extends Element>(onClickAction: (e: MouseEvent<T>) => void) => {
  const preventKeyDownScroll = (e: KeyboardEvent<HTMLDivElement>) => {
    // Prevent the spacebar from scrolling the page
    if (e.key === ' ') {
      e.preventDefault()
    }
  }

  const handleActionKeyUp = (e: KeyboardEvent<T>) => {
    // Handle Spacebar and Enter as if it was a click
    if (e.key === ' ' || e.key === 'Enter') {
      onClickAction(e as unknown as MouseEvent<T>)
    }
  }

  return { preventKeyDownScroll, handleActionKeyUp }
}

export default useKeyboardAction
