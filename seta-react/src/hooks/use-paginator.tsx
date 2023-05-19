import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { Flex, Pagination, Text } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'

import { pagesCount } from '~/utils/pagination-utils'

type Args = {
  total: number
  perPage: number
  page: number
  info?: { singular: string; plural?: string; currentPageItems?: number }
  resetPageDependencies?: unknown[]
  scrollDependencies?: unknown[]
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
 *     - `currentPageItems`: the number of items in the current page; if missing, the `perPage` value is used
 *   - `resetPageDependencies`: an array of dependencies that, when changed, will reset the page to 1
 *   - `scrollDependencies`: an array of dependencies that, when changed, will scroll the page to the `scrollTargetRef` element
 *   - `onPageChange`: a function that will be called when the page changes
 *
 * @returns an object with the following properties:
 *   - `paginator`: the paginator component
 *   - `info`: the info component, if `info` was given in the argument
 *   - `scrollTargetRef`: a ref that should be passed to the element that will be scrolled to when `scrollDependencies` changes
 *   - `scrollIntoView`: a function that can be called to scroll the page to the `scrollTargetRef` element
 */
const usePaginator = ({
  total,
  perPage,
  page,
  info,
  resetPageDependencies,
  scrollDependencies,
  onPageChange
}: Args) => {
  const { scrollIntoView, targetRef: scrollTargetRef } = useScrollIntoView<HTMLDivElement>({
    duration: 200,
    offset: 40
  })

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

  const paginator =
    total > perPage ? (
      <Flex align="center" justify="end" gap="sm">
        <Pagination total={pagesCount(total, perPage)} value={page} onChange={onPageChange} />
      </Flex>
    ) : null

  let infoElement: ReactElement | false = false

  if (total && info) {
    const { singular, plural, currentPageItems } = info

    const pageStart = (page - 1) * perPage
    const pageEnd = pageStart + (currentPageItems ?? perPage)

    const pageInfo =
      pageStart + 1 === pageEnd
        ? ` ${singular} ${pageStart + 1}`
        : ` ${plural ?? singular}s ${pageStart + 1}-${pageEnd}`

    infoElement = (
      <Text fz="md" color="gray.7">
        Showing {pageInfo} of {total}
      </Text>
    )
  }

  return {
    scrollIntoView,
    scrollTargetRef,
    paginator,
    info: infoElement || null
  }
}

export default usePaginator
