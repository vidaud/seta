import { useIntersection } from '@mantine/hooks'

/**
 * Hook based on the IntersectionObserver API to detect if an element is pinned
 * @returns `pinnedRef` to be passed to the element to be tracked and `isPinned` to check if the element is pinned
 */
const usePinned = () => {
  const { ref: pinnedRef, entry } = useIntersection({ threshold: 1 })

  const isPinned = entry?.isIntersecting === false

  return { pinnedRef, isPinned }
}

export default usePinned
