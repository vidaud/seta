import { useState } from 'react'
import { Box, Divider, Flex } from '@mantine/core'

import {
  LoadingType,
  useUploadDocuments
} from '~/pages/SearchPageNew/contexts/upload-documents-context'

import useDocumentDragEvents from '~/hooks/use-document-drag-events'

import * as S from './styles'

import FileUpload from '../FileUpload'
import TextUpload from '../TextUpload'
import UploadedDocs from '../UploadedDocs'

const getContentStyles = ({
  loading,
  textEditing,
  fileDragging
}: {
  loading: LoadingType | null
  textEditing: boolean
  fileDragging: boolean
}) => {
  const contentLoadingStyle = [
    S.uploads,
    (loading === LoadingType.DOCUMENTS || fileDragging) && S.uploadingDocs,
    textEditing && S.uploadingText
  ]

  const fileUploadStyle = (loading === LoadingType.TEXT || textEditing) && S.zeroWidth
  const textUploadStyle = (loading === LoadingType.DOCUMENTS || fileDragging) && S.zeroWidth
  const dividerStyle = (!!loading || textEditing || fileDragging) && S.zeroWidth

  return {
    contentLoadingStyle,
    fileUploadStyle,
    textUploadStyle,
    dividerStyle
  }
}

const UploadContainer = () => {
  const [textEditing, setTextEditing] = useState(false)
  const [fileDragging, setFileDragging] = useState(false)

  const { documents, loading } = useUploadDocuments()

  const hasDocuments = !!documents.length
  const showEditors = !hasDocuments || loading || textEditing || fileDragging

  useDocumentDragEvents({
    onDragOver: () => setFileDragging(true),
    onDragLeave: () => setFileDragging(false),
    disabled: !hasDocuments || textEditing
  })

  const { contentLoadingStyle, fileUploadStyle, textUploadStyle, dividerStyle } = getContentStyles({
    loading,
    textEditing,
    fileDragging
  })

  const content = showEditors ? (
    <Box css={contentLoadingStyle}>
      <FileUpload
        css={fileUploadStyle}
        dropMessage={fileDragging}
        onAfterDrop={() => setFileDragging(false)}
      />

      <Divider
        css={[S.orDivider, dividerStyle]}
        orientation="vertical"
        color="gray.4"
        variant="dashed"
      />

      <TextUpload
        css={textUploadStyle}
        editing={textEditing}
        onEdit={() => setTextEditing(true)}
        onCancel={() => setTextEditing(false)}
      />
    </Box>
  ) : (
    <UploadedDocs onAddText={() => setTextEditing(true)} />
  )

  return (
    <Flex direction="column" css={S.root} data-docs={!showEditors}>
      {content}
    </Flex>
  )
}

export default UploadContainer
