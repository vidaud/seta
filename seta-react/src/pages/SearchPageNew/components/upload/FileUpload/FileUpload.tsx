import { useState } from 'react'
import { Loader, Progress, Stack, Text, Transition } from '@mantine/core'
import type { DropzoneProps } from '@mantine/dropzone'
import { Dropzone } from '@mantine/dropzone'
import { CgFileDocument } from 'react-icons/cg'
import { FiUpload } from 'react-icons/fi'
import { ImCancelCircle } from 'react-icons/im'

import { useUploadDocuments } from '~/pages/SearchPageNew/contexts/upload-documents-context'

import useDocumentDragEvents from '~/hooks/use-document-drag-events'
import type { ClassNameProp } from '~/types/children-props'

import * as S from './styles'

import { ACCEPTED_MIME_TYPES, MAX_FILES, MAX_FILE_SIZE } from '../common/constants'
import * as CS from '../common/styles'

type Props = ClassNameProp & {
  dropMessage?: boolean
  onAfterDrop?: () => void
}

const FileUpload = ({ className, dropMessage, onAfterDrop }: Props) => {
  const [documentDragOver, setDocumentDragOver] = useState(false)

  const { uploadFiles, progress, loading } = useUploadDocuments()

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

  const uploading = !!progress

  const dropzoneStyle = [
    S.dropzone,
    documentDragOver && S.dropzoneHighlight,
    uploading && S.dropzoneUploading
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
          spacing="1.8rem"
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

  return (
    <Dropzone
      className={className}
      css={dropzoneStyle}
      accept={ACCEPTED_MIME_TYPES}
      maxFiles={MAX_FILES}
      maxSize={MAX_FILE_SIZE}
      disabled={uploading}
      onDrop={handleDrop}
      onReject={handleReject}
    >
      <Stack align="center" justify="center" ta="center">
        <Dropzone.Accept>
          <FiUpload css={[CS.icon, S.iconAccept]} />
        </Dropzone.Accept>

        <Dropzone.Reject>
          <ImCancelCircle css={[CS.icon, S.iconReject]} />
        </Dropzone.Reject>

        <Dropzone.Idle>
          <CgFileDocument css={CS.icon} />
        </Dropzone.Idle>

        <Text size="xl" color="gray.7" inline>
          {message}
        </Text>

        <Text size="sm" color="dimmed" inline mt={2}>
          PDFs, Word, Excel, PowerPoint, and text files, up to 5MB each
        </Text>
      </Stack>

      {progressInfo}
    </Dropzone>
  )
}

export default FileUpload
