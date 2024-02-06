import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Group, Stack, Tooltip } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { CgFileDocument } from 'react-icons/cg'
import { RiArrowGoBackLine } from 'react-icons/ri'

import ScrollModal from '~/components/ScrollModal'
import AnnotationsPreview from '~/pages/SearchPageNew/components/AnnotationsPreview'
import { KEYWORD_SELECTED_ID } from '~/pages/SearchPageNew/components/AnnotationsPreview/AnnotationsPreview'

import { useChunks } from '~/api/search/chunks'
import usePaginator from '~/hooks/use-paginator'
import type { ModalStateProps } from '~/types/lib-props'
import type { Annotation } from '~/types/search/annotations'

import * as S from './styles'

import DocumentChunks from '../DocumentChunks'

const CHUNKS_PER_PAGE = 5
const SCROLL_DELAY = 300
const SCROLL_DURATION = 300
const SCROLL_OFFSET = 12

type Props = {
  title: string
  documentId: string
  documentAnnotations?: Annotation[]
  chunkNumber: number
  queryTerms?: string[]
} & ModalStateProps

const getCurrentChunkPage = (chunkNumber: number, perPage = CHUNKS_PER_PAGE) =>
  Math.floor(chunkNumber / perPage) + 1

const DocumentChunksModal = ({
  documentId,
  documentAnnotations,
  chunkNumber,
  queryTerms,
  opened,
  title,
  ...props
}: Props) => {
  const currentChunkPage = getCurrentChunkPage(chunkNumber)

  const [page, setPage] = useState(currentChunkPage)

  const [currentAnnotationId, setCurrentAnnotationId] = useState<string>(KEYWORD_SELECTED_ID)

  const prevOpenedRef = useRef(opened)

  const { data, isLoading, error, refetch } = useChunks(documentId, {
    enabled: opened,
    page,
    perPage: CHUNKS_PER_PAGE
  })

  const {
    info,
    paginator,
    scrollableRef: paginationScrollableRef,
    scrollTargetRef
  } = usePaginator<HTMLDivElement>({
    page,
    perPage: CHUNKS_PER_PAGE,
    total: data?.num_chunks ?? 0,
    info: { singular: 'document chunk' },
    scrollOnPageChange: page !== currentChunkPage,
    onPageChange: setPage
  })

  const {
    scrollIntoView,
    cancel: cancelScroll,
    targetRef,
    scrollableRef
  } = useScrollIntoView<HTMLDivElement, HTMLDivElement>({
    duration: SCROLL_DURATION,
    offset: SCROLL_OFFSET
  })

  const setScrollableRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        scrollableRef.current = node
        paginationScrollableRef.current = node
      }
    },
    [scrollableRef, paginationScrollableRef]
  )

  const showCurrentChunk = useCallback(() => {
    setPage(currentChunkPage)
  }, [currentChunkPage])

  // Switch to the current chunk page when the modal is opened
  useEffect(() => {
    if (opened && !prevOpenedRef.current) {
      showCurrentChunk()
    }

    prevOpenedRef.current = opened
  }, [opened, showCurrentChunk])

  useEffect(() => {
    // Wait for the modal to finish the opening animation before scrolling
    const timeout = setTimeout(() => {
      if (opened) {
        scrollIntoView()
      }
    }, SCROLL_DELAY)

    return () => {
      clearTimeout(timeout)
      cancelScroll()
    }
  }, [opened, scrollIntoView, cancelScroll])

  useEffect(() => {
    if (!opened) {
      setTimeout(() => setCurrentAnnotationId(KEYWORD_SELECTED_ID), SCROLL_DELAY)
    }
  }, [opened])

  const actions = (
    <Group spacing="lg">
      {page !== currentChunkPage && !isLoading && (
        <Tooltip label="Go back to current chunk">
          <Button
            variant="outline"
            color="teal"
            size="xs"
            leftIcon={<RiArrowGoBackLine size="1.1rem" />}
            onClick={showCurrentChunk}
          >
            Current Chunk
          </Button>
        </Tooltip>
      )}

      {paginator}
    </Group>
  )

  const titleEl = documentAnnotations?.length ? (
    <Stack spacing="sm">
      <div>{title}</div>

      <AnnotationsPreview
        annotations={documentAnnotations}
        currentAnnotationId={currentAnnotationId}
        onAnnotationClick={setCurrentAnnotationId}
      />
    </Stack>
  ) : (
    title
  )

  const { chunk_list: chunks, num_chunks: chunksCount = 0 } = data ?? {}

  return (
    <ScrollModal
      css={S.root}
      scrollableRef={setScrollableRef}
      opened={opened}
      title={titleEl}
      icon={<CgFileDocument />}
      {...props}
      info={info}
      actions={actions}
      fullScreenToggle
    >
      <DocumentChunks
        ref={scrollTargetRef}
        currentChunkNumber={chunkNumber}
        currentChunkRef={targetRef}
        totalChunks={chunksCount}
        selectedAnnotationId={currentAnnotationId}
        queryTerms={queryTerms}
        data={chunks}
        isLoading={isLoading}
        error={error}
        onTryAgain={refetch}
      />
    </ScrollModal>
  )
}

export default DocumentChunksModal
