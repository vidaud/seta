import type { DefaultMantineColor } from '@mantine/core'
import { Indicator, Loader, Tooltip } from '@mantine/core'
import { IconPaperclip } from '@tabler/icons-react'

import ActionIconExtended from '~/components/ActionIconExtended'
import { useUploadDocuments } from '~/pages/SearchPageNew/contexts/upload-documents-context'

import type { Variant } from '~/types/lib-props'

import * as S from './styles'

type Props = {
  active?: boolean
  inputFocused?: boolean
  onClick?: () => void
}

const UploadButton = ({ active, inputFocused, onClick }: Props) => {
  const { loading, documents } = useUploadDocuments()

  const count = documents.length

  const color: DefaultMantineColor = active ? 'blue' : 'gray.5'
  const variant: Variant = active ? 'light' : 'outline'

  return (
    <Indicator
      label={count}
      disabled={!count}
      color="teal"
      size={22}
      withBorder
      position="top-start"
      style={{ zIndex: '10' }}
    >
      <Tooltip label="Attach files or enter large amounts of text" disabled={!!count}>
        <ActionIconExtended
          css={S.uploadButton}
          className="upload-button"
          color={color}
          variant={variant}
          hoverColor="blue"
          hoverVariant="light"
          size="xl"
          onClick={onClick}
          id="search-upload"
          data-input-focused={inputFocused}
        >
          {loading ? <Loader color="blue.4" size="sm" /> : <IconPaperclip />}
        </ActionIconExtended>
      </Tooltip>
    </Indicator>
  )
}

export default UploadButton
