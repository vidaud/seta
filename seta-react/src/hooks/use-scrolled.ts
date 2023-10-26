import { useState } from 'react'

export type Position = {
  x: number
  y: number
}

type Props = {
  delta: number
  preventSetScrolled?: (position: Position) => boolean | void
}

const useScrolled = (args?: Props) => {
  const { delta = 10, preventSetScrolled } = args ?? {}

  const [scrolled, setScrolled] = useState(false)

  const handleScrollChange = (position: Position) => {
    if (preventSetScrolled) {
      const preventSet = preventSetScrolled(position)

      if (preventSet) {
        return
      }
    }

    setScrolled(position.y > delta)
  }

  return {
    scrolled,
    setScrolled,
    handleScrollChange
  }
}

export default useScrolled
