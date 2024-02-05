import { keyframes } from '@mantine/core'

export const growX = keyframes({
  '0%': { transform: 'scaleX(0)' },
  '100%': { transform: 'scaleX(1)' }
})

export const slideDown = keyframes({
  '0%': { transform: 'translateY(-100%)', opacity: 0 },
  '100%': { transform: 'translateY(0)', opacity: 1 }
})

export const slideRight = keyframes({
  '0%': { transform: 'translateX(-100%)', opacity: 0 },
  '100%': { transform: 'translateX(0)', opacity: 1 }
})

export const rollSlideRight = keyframes({
  '0%': { transform: 'translateX(-100%) rotate(-360deg)', opacity: 0 },
  '100%': { transform: 'translateX(0) rotate(0)', opacity: 1 }
})

export const minSlideFade = keyframes({
  '0%': { transform: 'translateY(-10%)', opacity: 0 },
  '100%': { transform: 'translateY(0)', opacity: 1 }
})

export const growAndRestore = keyframes({
  '0%': { transform: 'scale(0)', opacity: 0 },
  '50%': { transform: 'scale(1.2)' },
  '100%': { transform: 'scale(1)', opacity: 1 }
})

export const growBounce = keyframes({
  '0%': { transform: 'scale(0)' },
  '50%': { transform: 'scale(1.2)' },
  '65%': { transform: 'scale(1.1)' },
  '80%': { transform: 'scale(1.2)' },
  '100%': { transform: 'scale(1)' }
})

export const wiggleX = keyframes({
  '0%': { transform: 'translateX(0)', opacity: 0 },
  '20%': { transform: 'translateX(-3px)' },
  '40%': { transform: 'translateX(0)' },
  '60%': { transform: 'translateX(-3px)' },
  '75%': { transform: 'translateX(0)' },
  '90%': { transform: 'translateX(-2px)' },
  '100%': { transform: 'translateX(0)', opacity: 1 }
})

export const turnAndGrow = keyframes({
  '0%': { transform: 'rotate(0) scale(0)' },
  '20%': { transform: 'rotate(0) scale(1)' },
  '50%': { transform: 'rotate(180deg) scale(0.7)' },
  '100%': { transform: 'rotate(360deg) scale(1)' }
})

export const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 }
})
