import { useState, useEffect, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Button, Divider, Group, Modal, Stack, Text } from '@mantine/core'

import CancelButton from '~/components/CancelButton/'
import ClosableAlert from '~/components/ClosableAlert'

import * as S from './styles'
import type { Value } from './types'
import { getInputElement } from './utils'

type Props<T extends Value> = {
  title?: ReactNode
  label?: ReactNode
  placeholder?: string
  initialValue: T
  invalidChars?: string[]
  optional?: boolean
  withStar?: boolean
  submitLabel?: string
  loading?: boolean
  error?: string
  errorTitle?: string
  opened: boolean
  withinPortal?: boolean
  zIndex?: number
  onClose: () => void
  onSubmit: (value: T) => void
}

const PromptModal = <T extends Value>(props: Props<T>) => {
  const {
    label = 'Enter a value',
    placeholder = 'Value',
    initialValue,
    invalidChars,
    optional,
    withStar,
    submitLabel = 'Submit',
    loading,
    error,
    errorTitle,
    opened,
    onClose,
    onSubmit,
    ...modalProps
  } = props

  const [value, setValue] = useState<T>(initialValue)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    if (opened) {
      setFieldError(null)

      // Select the input value after the modal opens
      setTimeout(() => {
        inputRef.current?.select()
      }, 200)
    }
  }, [opened])

  const validateInput = () => {
    if (!optional && typeof value === 'string' && !value.trim()) {
      setFieldError('Please enter a value')
      inputRef.current?.focus()

      return false
    }

    return true
  }

  const handleSubmit = () => {
    if (validateInput()) {
      onSubmit(value)
    }
  }

  const handleChange = (v: T) => {
    setValue(v)

    if (fieldError) {
      setFieldError(null)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (invalidChars?.includes(e.key)) {
      e.preventDefault()

      return
    }

    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const errorAlert = !!error && (
    <ClosableAlert title={errorTitle} color="red" variant="outline">
      {error}
      <br />
      Please try again.
    </ClosableAlert>
  )

  const input = getInputElement({
    value,
    error: fieldError,
    placeholder,
    ref: inputRef,
    onChange: handleChange,
    onKeyDown: handleKeyDown
  })

  const labelElement =
    typeof label === 'string' ? (
      <Text size="sm" color="dark">
        {label}
      </Text>
    ) : (
      label
    )

  const redStar = withStar && <Text css={S.redStar}>*</Text>

  return (
    <Modal
      css={S.root}
      centered
      size="auto"
      withCloseButton={false}
      opened={opened}
      onClose={onClose}
      {...modalProps}
    >
      <Stack>
        {props.title && <Divider />}

        <Stack my="xs" mx="sm">
          {errorAlert}

          <Stack spacing={8}>
            <Group spacing={4}>
              {labelElement}
              {redStar}
            </Group>

            {input}
          </Stack>
        </Stack>

        <Divider />

        <Group position="right" spacing="sm">
          <CancelButton onClick={onClose} />

          <Button color="teal" loading={loading} onClick={handleSubmit}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default PromptModal
