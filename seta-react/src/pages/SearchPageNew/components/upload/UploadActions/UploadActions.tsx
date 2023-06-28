import { useMemo } from 'react'
import { ActionIcon, FileButton, Group, Text, Tooltip } from '@mantine/core'
import { CgFileDocument } from 'react-icons/cg'
import { FaAlignLeft } from 'react-icons/fa'
import { FiUpload } from 'react-icons/fi'
import { MdClose } from 'react-icons/md'

import { useUploadDocuments } from '~/pages/SearchPageNew/contexts/upload-documents-context'

import { EmbeddingType } from '~/types/embeddings'

import * as S from './styles'

import { ACCEPTED_MIME_TYPES, MAX_FILE_SIZE } from '../common/constants'

type Props = {
  onAddText?: () => void
  onRemoveAll?: () => void
}

const UploadActions = ({ onAddText, onRemoveAll }: Props) => {
  const { uploadFiles, documents } = useUploadDocuments()

  const hasDocs = useMemo(
    () => documents.some(item => item.type === EmbeddingType.File),
    [documents]
  )

  const hasText = useMemo(
    () => documents.some(item => item.type === EmbeddingType.Text),
    [documents]
  )

  const handleUpload = (files: File[]) => {
    const acceptedFiles = files.filter(file => file.size <= MAX_FILE_SIZE)

    uploadFiles(acceptedFiles)
  }

  return (
    <Group css={S.root} position="apart" align="center">
      <Tooltip.Group openDelay={300} closeDelay={200}>
        <Group spacing="xs">
          <FileButton onChange={handleUpload} multiple accept={ACCEPTED_MIME_TYPES.join(',')}>
            {props => (
              <Tooltip label={hasDocs ? 'Upload more documents' : 'Upload documents'}>
                <ActionIcon {...props} variant="outline" size="lg" radius="xl" color="teal">
                  <CgFileDocument size="1.2rem" />
                </ActionIcon>
              </Tooltip>
            )}
          </FileButton>

          <Tooltip label={hasText ? 'Add more text' : 'Add text'}>
            <ActionIcon
              variant="outline"
              size="lg"
              radius="xl"
              color="blue"
              mr="sm"
              onClick={onAddText}
            >
              <FaAlignLeft />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Remove all entries">
            <ActionIcon variant="outline" size="lg" radius="xl" color="red" onClick={onRemoveAll}>
              <MdClose size="1.3rem" />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Tooltip.Group>

      <Group spacing="sm">
        <FiUpload css={S.uploadIcon} />

        <Text size="sm" color="gray.5">
          Drop more documents on this panel <br /> or use the buttons on the left to add more
          content
        </Text>
      </Group>
    </Group>
  )
}

export default UploadActions
