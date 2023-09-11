import { keyframes } from '@mantine/core'

export const growX = keyframes({
  '0%': { transform: 'scaleX(0)' },
  '100%': { transform: 'scaleX(1)' }
})

export const slideDown = keyframes({
  '0%': { transform: 'translateY(-100%)', opacity: 0 },
  '100%': { transform: 'translateY(0)', opacity: 1 }
})
