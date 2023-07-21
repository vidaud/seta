import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'
import { Flex, Pagination, Text } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'

import { pagesCount } from '~/utils/pagination-utils'

type Args = {
  total: number
  perPage: number
  page: number
  info?: { singular: string; plural?: string }
  resetPageDependencies?: unknown[]
  scrollDependencies?: unknown[]
  scrollOnPageChange?: boolean
  onPageChange: (page: number) => void
}

/**
 * Use this hook to create a paginator component.
 * It takes an object argument with the following properties:
 *   - `total`: the total number of items to paginate
 *   - `perPage`: the number of items per page
 *   - `page`: the current page
 *   - `info`: when present, an element displaying the current page info will be returned - it has the following properties:
 *     - `singular`: the singular form of the item name - e.g. "document"
 *     - `plural`: the plural form of the item name; if missing, an 's' is added to the singular
 *   - `resetPageDependencies`: an array of dependencies that, when changed, will reset the page to 1
 *   - `scrollDependencies`: an array of dependencies that, when changed, will scroll the page to the `scrollTargetRef` element
 *   - `scrollOnPageChange`: whether to scroll the page when the page changes; defaults to `true`
 *   - `onPageChange`: a function that will be called when the page changes
 *
 * @returns an object with the following properties:
 *   - `paginator`: the paginator component
 *   - `info`: the info component, if `info` was given in the argument
 *   - `scrollTargetRef`: a ref that should be passed to the element that will be scrolled to when `scrollDependencies` changes
 *   - `scrollIntoView`: a function that can be called to scroll the page to the `scrollTargetRef` element
 *   - `scrollableRef`: a ref that should be passed to the element that will be scrolled when `scrollOnPageChange` is `true`;
 *      if not used, the whole page will be scrolled
 */
const usePaginator = <TScrollable extends HTMLElement | null = null>({
  total,
  perPage,
  page,
  info,
  resetPageDependencies,
  scrollDependencies,
  scrollOnPageChange = true,
  onPageChange
}: Args) => {
  const {
    scrollIntoView,
    targetRef: scrollTargetRef,
    scrollableRef
  } = useScrollIntoView<HTMLDivElement, TScrollable>({
    duration: 200,
    offset: 40
  })

  const prevPageRef = useRef(page)

  const hasScrollDependencies = !!scrollDependencies?.length

  useEffect(() => {
    if (resetPageDependencies) {
      onPageChange(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetPageDependencies)

  useEffect(() => {
    if (scrollDependencies) {
      scrollIntoView({ alignment: 'start' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollIntoView, scrollDependencies].flat())

  useEffect(() => {
    // Don't scroll if there are scroll dependencies, as they will manage scrolling the page
    if (hasScrollDependencies) {
      return
    }

    if (scrollOnPageChange && prevPageRef !== null && prevPageRef.current !== page) {
      scrollIntoView({ alignment: 'start' })

      prevPageRef.current = page
    }
  }, [hasScrollDependencies, page, scrollOnPageChange, scrollIntoView])

  const paginator =
    total > perPage ? (
      <Flex align="center" justify="end" gap="sm">
        <Pagination
          total={pagesCount(total, perPage)}
          value={page}
          siblings={1}
          onChange={onPageChange}
        />
      </Flex>
    ) : null

  let infoElement: ReactElement | false = false

  if (total && info) {
    const { singular, plural } = info

    const pageStart = (page - 1) * perPage
    const pageEnd = Math.min(pageStart + perPage, total)

    const pageInfo =
      pageStart + 1 === pageEnd ? ` ${pageStart + 1}` : ` ${pageStart + 1}-${pageEnd}`

    const totalInfo = total === 1 ? ` ${total} ${singular}` : ` ${total} ${plural ?? singular}s`

    infoElement = (
      <Text fz="md" color="gray.7">
        Showing {pageInfo} of {totalInfo}
      </Text>
    )
  }

  return {
    scrollIntoView,
    scrollTargetRef,
    scrollableRef,
    paginator,
    info: infoElement || null
  }
}

export default usePaginator
