import { ActionIcon, Indicator, Loader, Tooltip } from '@mantine/core'
import { IconCloudUp } from '@tabler/icons-react'

import { useUploadDocuments } from '~/pages/SearchPageNew/contexts/upload-documents-context'

import * as S from './styles'

type Props = {
  onClick?: () => void
}

const UploadButton = ({ onClick }: Props) => {
  const { loading, documents } = useUploadDocuments()

  const count = documents.length

  return (
    <Indicator
      label={count}
      disabled={!count}
      color="teal"
      size={22}
      withBorder
      position="top-start"
    >
      <Tooltip label="Upload files or enter large amounts of text" disabled={!!count}>
        <ActionIcon
          css={S.uploadButton}
          color="blue"
          size="xl"
          variant="filled"
          onClick={onClick}
          id="search-upload"
        >
          {loading ? <Loader color="blue.0" size="sm" /> : <IconCloudUp />}
        </ActionIcon>
      </Tooltip>
    </Indicator>
  )
}

export default UploadButton
