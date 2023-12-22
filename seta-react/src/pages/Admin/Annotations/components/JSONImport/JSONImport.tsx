import { useRef, useState } from 'react'
import { Button, Group, JsonInput, Stack, Text } from '@mantine/core'
import type { AxiosError } from 'axios'
import { GrTextAlignLeft } from 'react-icons/gr'
import { HiUpload } from 'react-icons/hi'

import CancelButton from '~/components/CancelButton'

import { useImportAnnotations } from '~/api/admin/annotations'
import useSpacebarAction from '~/hooks/use-spacebar-action'
import type { ClassNameProp } from '~/types/children-props'
import { notifications } from '~/utils/notifications'

import * as S from './styles'

import { defaultMessage } from '../../constants'

type Props = ClassNameProp & {
  editing?: boolean
  onEdit?: () => void
  onCancel?: () => void
}

const JSONImport = ({ editing, onEdit, onCancel }: Props) => {
  const [jsonInput, setJsonInput] = useState('[]')
  const setImportAnnotationsMutation = useImportAnnotations()
  const txtRef = useRef<HTMLTextAreaElement>(null)
  const [invalid, setInvalid] = useState(jsonInput !== '[]' ? false : true)

  const handleRootClick = () => {
    onEdit?.()
  }

  const handleJSONChange = jsonValue => {
    setJsonInput(jsonValue)
    setInvalid(!jsonValue.trim())
  }

  const handleImport = async () => {
    if (jsonInput.trim().length === 0) {
      setInvalid(true)
      txtRef.current?.focus()

      return
    }

    setImportAnnotationsMutation.mutate(
      { annotations: JSON.parse(jsonInput) },
      {
        onSuccess: () => {
          notifications.showSuccess(`Annotation Added Successfully!`, { autoClose: true })
          setInvalid(false)
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: AxiosError | any) => {
          notifications.showError('Add Annotation Failed!', {
            description: error?.response?.data?.message,
            autoClose: true
          })
        }
      }
    )

    onCancel?.()
  }

  const { handleKeyUp, preventKeyDownScroll } = useSpacebarAction(handleRootClick)

  if (editing) {
    return (
      <Stack h={420}>
        <JsonInput
          css={S.textArea}
          ref={txtRef}
          variant="filled"
          size="md"
          placeholder={defaultMessage}
          maxLength={10000}
          autoFocus
          validationError="Invalid JSON"
          value={jsonInput}
          onChange={handleJSONChange}
        />

        <Group spacing="sm" css={S.actions}>
          <CancelButton onClick={onCancel} data-cancel />

          <Button
            color="teal"
            variant="filled"
            leftIcon={<HiUpload size="1.1rem" />}
            onClick={handleImport}
            disabled={invalid}
          >
            Import JSON
          </Button>
        </Group>
      </Stack>
    )
  }

  return (
    <Stack
      h={420}
      css={S.root}
      align="center"
      justify="center"
      ta="center"
      tabIndex={0}
      onClick={handleRootClick}
      onKeyUp={handleKeyUp}
      onKeyDown={preventKeyDownScroll}
    >
      <GrTextAlignLeft css={S.icon} preserveAspectRatio="none" style={{ width: '42px' }} />

      <Text size="xl" color="gray.7" inline>
        Click and type your JSON here
      </Text>

      <Text size="sm" color="dimmed" inline mt={2}>
        Or copy and paste it from another source
      </Text>
    </Stack>
  )
}

export default JSONImport
