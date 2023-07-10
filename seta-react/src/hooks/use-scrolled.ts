import { useState } from 'react'

type Position = {
  x: number
  y: number
}

type Props = {
  delta: number
  preventSetScrolled?: (position: Position) => boolean | void
}

const useScrolled = ({ delta = 0, preventSetScrolled }: Props) => {
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
