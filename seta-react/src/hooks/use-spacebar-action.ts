import type { KeyboardEvent, MouseEvent } from 'react'

// `e` is a `MouseEvent` so that we can directly pass a click handler to this hook
const useSpacebarAction = <T extends Element>(onSpacebarPress: (e: MouseEvent<T>) => void) => {
  const preventKeyDownScroll = (e: KeyboardEvent<HTMLDivElement>) => {
    // Prevent the spacebar from scrolling the page
    if (e.key === ' ') {
      e.preventDefault()
    }
  }

  const handleKeyUp = (e: KeyboardEvent<T>) => {
    // Handle the spacebar as if it was a click
    if (e.key === ' ') {
      onSpacebarPress(e as unknown as MouseEvent<T>)
    }
  }

  return { preventKeyDownScroll, handleKeyUp }
}

export default useSpacebarAction
