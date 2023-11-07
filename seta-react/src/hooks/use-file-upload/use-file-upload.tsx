import { useState } from 'react'
import { Loader, Progress, Stack, Transition, Text } from '@mantine/core'
import type { DropzoneProps } from '@mantine/dropzone'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import { CgFileDocument } from 'react-icons/cg'
import { FiUpload } from 'react-icons/fi'
import { ImCancelCircle } from 'react-icons/im'

import { getFilesEmbeddingInfo } from '~/api/embeddings/embedding-info'
import useDocumentDragEvents from '~/hooks/use-document-drag-events'

import * as S from './styles'
import useUploadReducer from './use-upload-reducer'

const ACCEPTED_MIME_TYPES: string[] = [
  MIME_TYPES.pdf,
  MIME_TYPES.doc,
  MIME_TYPES.docx,
  MIME_TYPES.ppt,
  MIME_TYPES.pptx,
  MIME_TYPES.xls,
  MIME_TYPES.xlsx,
  'text/plain'
]

const MAX_FILES = 10
const MAX_FILE_SIZE = 5 * 1024 ** 2 // 5 MB

const DROPZONE_HINT = 'PDFs, Word, Excel, PowerPoint, and text files, up to 5MB each'

type Args = {
  accept?: string[]
  maxFiles?: number
  maxSize?: number
  dropMessage?: boolean
  dropzoneHint?: string
  dropzoneClassName?: string
  onAfterDrop?: () => void
}

const useFileUpload = ({
  accept = ACCEPTED_MIME_TYPES,
  maxFiles = MAX_FILES,
  maxSize = MAX_FILE_SIZE,
  dropMessage,
  dropzoneHint,
  dropzoneClassName,
  onAfterDrop
}: Args) => {
  const [{ documents, loading, progress, error }, dispatch] = useUploadReducer()

  const [documentDragOver, setDocumentDragOver] = useState(false)

  useDocumentDragEvents({
    onDragOver: () => setDocumentDragOver(true),
    onDragLeave: () => setDocumentDragOver(false),
    onDragEnd: () => setDocumentDragOver(false)
  })

  const handleDrop: DropzoneProps['onDrop'] = async files => {
    setDocumentDragOver(false)

    await uploadFiles(files)

    onAfterDrop?.()
  }

  const handleReject: DropzoneProps['onReject'] = () => {
    setDocumentDragOver(false)
    onAfterDrop?.()
  }

  const uploadFiles = async (files: File[]) => {
    dispatch({ type: 'upload-start' })

    try {
      const docs = await getFilesEmbeddingInfo(files, {
        onProgress: value => dispatch({ type: 'set-progress', progress: value }),
        existing: documents
      })

      // Allow the 100% step to be shown for a second
      setTimeout(() => {
        dispatch({ type: 'upload-finished', documents: docs })
      }, 1000)
    } catch (err) {
      const errorInstance =
        err instanceof Error ? err : new Error('There was an error uploading files')

      dispatch({ type: 'error', error: errorInstance })
    }
  }

  const dropzoneStyle = [
    S.dropzone,
    documentDragOver && S.dropzoneHighlight,
    loading && S.dropzoneUploading
  ]

  const message =
    documentDragOver || dropMessage
      ? 'Drop documents here'
      : 'Drag documents here or click to select files'

  const progressInfo = (
    <Transition transition="fade" duration={300} mounted={!!loading}>
      {styles => (
        <Stack
          align="center"
          justify="center"
          ta="center"
          spacing="3rem"
          css={S.progress}
          style={styles}
        >
          <Loader variant="dots" color="teal" size="lg" />
          <Progress value={progress?.percent ?? 100} color="teal" size="lg" />

          <Text size="md" color="teal.9" inline>
            {progress?.info ?? 'Done.'}
          </Text>
        </Stack>
      )}
    </Transition>
  )

  const dropzone = (
    <Dropzone
      className={dropzoneClassName}
      css={dropzoneStyle}
      accept={accept}
      maxFiles={maxFiles}
      maxSize={maxSize}
      disabled={loading}
      onDrop={handleDrop}
      onReject={handleReject}
    >
      <Stack align="center" justify="center" ta="center">
        <Dropzone.Accept>
          <FiUpload css={[S.icon, S.iconAccept]} />
        </Dropzone.Accept>

        <Dropzone.Reject>
          <ImCancelCircle css={[S.icon, S.iconReject]} />
        </Dropzone.Reject>

        <Dropzone.Idle>
          <CgFileDocument css={S.icon} />
        </Dropzone.Idle>

        <Text size="xl" color="gray.7" inline>
          {message}
        </Text>

        <Text size="sm" color="dimmed" inline mt={2}>
          {dropzoneHint ?? DROPZONE_HINT}
        </Text>
      </Stack>

      {progressInfo}
    </Dropzone>
  )

  return {
    documents,
    loading,
    progress,
    error,
    dropzone
  }
}

export default useFileUpload
