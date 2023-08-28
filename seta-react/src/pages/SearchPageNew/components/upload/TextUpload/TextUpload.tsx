import type { ChangeEventHandler } from 'react'
import { useRef, useState } from 'react'
import { Button, Group, Stack, Text, Textarea } from '@mantine/core'
import { GrTextAlignLeft } from 'react-icons/gr'
import { HiUpload } from 'react-icons/hi'

import CancelButton from '~/components/CancelButton'
import { useUploadDocuments } from '~/pages/SearchPageNew/contexts/upload-documents-context'

import useSpacebarAction from '~/hooks/use-spacebar-action'
import type { ClassNameProp } from '~/types/children-props'

import * as S from './styles'

import * as CS from '../common/styles'

type Props = ClassNameProp & {
  editing?: boolean
  onEdit?: () => void
  onCancel?: () => void
}

const TextUpload = ({ className, editing, onEdit, onCancel }: Props) => {
  const [text, setText] = useState('')
  const [invalid, setInvalid] = useState(false)

  const { uploadText, loading } = useUploadDocuments()

  const isLoading = !!loading

  const txtRef = useRef<HTMLTextAreaElement>(null)

  const handleRootClick = () => {
    onEdit?.()
  }

  const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = event => {
    const { value } = event.target

    setText(value)
    setInvalid(!value.trim())
  }

  const handleUpload = async () => {
    if (text.trim().length === 0) {
      setInvalid(true)
      txtRef.current?.focus()

      return
    }

    setInvalid(false)

    await uploadText(text)

    // Reset the text editing state
    onCancel?.()
  }

  const { handleKeyUp, preventKeyDownScroll } = useSpacebarAction(handleRootClick)

  if (editing) {
    return (
      <Stack className={className}>
        <Textarea
          css={S.textArea}
          ref={txtRef}
          variant="filled"
          size="md"
          placeholder="Type or paste your text here"
          maxLength={10000}
          autoFocus
          error={invalid && 'The text is required'}
          value={text}
          onChange={handleTextChange}
        />

        <Group spacing="sm" css={S.actions} data-loading={isLoading}>
          <CancelButton onClick={onCancel} data-cancel />

          <Button
            color="teal"
            variant="filled"
            leftIcon={<HiUpload size="1.1rem" />}
            loading={isLoading}
            onClick={handleUpload}
          >
            {isLoading ? 'Uploading...' : 'Upload Text'}
          </Button>
        </Group>
      </Stack>
    )
  }

  return (
    <Stack
      className={className}
      css={S.root}
      align="center"
      justify="center"
      ta="center"
      tabIndex={0}
      onClick={handleRootClick}
      onKeyUp={handleKeyUp}
      onKeyDown={preventKeyDownScroll}
    >
      <GrTextAlignLeft css={CS.icon} preserveAspectRatio="none" style={{ width: '42px' }} />

      <Text size="xl" color="gray.7" inline>
        Click and type your text here
      </Text>

      <Text size="sm" color="dimmed" inline mt={2}>
        Or copy and paste it from another source
      </Text>
    </Stack>
  )
}

export default TextUpload
