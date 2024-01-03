import { useState } from 'react'
import {
  TextInput,
  Group,
  createStyles,
  Button,
  ActionIcon,
  ColorInput,
  Autocomplete
} from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'
import type { AxiosError } from 'axios'

import {
  AnnotationFormProvider,
  useAnnotation
} from '~/pages/Admin/Annotations/contexts/annotation-context'

import { useCreateAnnotation } from '~/api/admin/annotations'
import type { AnnotationResponse } from '~/api/types/annotations-types'
import { notifications } from '~/utils/notifications'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  sized: {
    width: '80%'
  },
  form: {
    textAlign: 'left'
  }
})

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`

const CreateForm = ({ close, categories }) => {
  const { classes, cx } = useStyles()
  const setCreateAnnotationMutation = useCreateAnnotation()
  const [color, onChange] = useState(randomColor())

  const form = useAnnotation({
    initialValues: {
      label: '',
      color: color,
      category: ''
    },
    validate: {
      label: (value, values) =>
        values && values.label.length < 3 ? 'Label should have at least 3 characters' : null,
      color: (value, values) =>
        values && values.color.length < 1
          ? `String should match pattern '^#(?:[0-9a-fA-F]{3}){1,2}$'"}`
          : null,
      category: (value, values) =>
        values && values.category.length < 3
          ? 'Category should have at least 3 characters and should be unique'
          : null
    }
  })

  const handleSubmit = (values: AnnotationResponse) => {
    const updatedValues = {
      label: values.label,
      color: color,
      category: values.category
    }

    setCreateAnnotationMutation.mutate(updatedValues, {
      onSuccess: () => {
        notifications.showSuccess(`Annotation Added Successfully!`, { autoClose: true })
        close()
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: AxiosError | any) => {
        notifications.showError('Add Annotation Failed!', {
          description: error?.response?.data?.message,
          autoClose: true
        })
      }
    })
  }

  return (
    <>
      <AnnotationFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Annotation"
            description="Annotation should be unique."
            {...form.getInputProps('label')}
            className={cx(classes.input)}
            placeholder="Enter annotation name ..."
            withAsterisk
            data-autofocus
          />
          <Autocomplete
            data={categories}
            label="Category"
            {...form.getInputProps('category')}
            className={cx(classes.input)}
            withAsterisk
          />
          <ColorInput
            placeholder="Pick color"
            label="Color"
            value={color}
            onChange={onChange}
            rightSection={
              <ActionIcon onClick={() => onChange(randomColor())}>
                <IconRefresh size="1rem" />
              </ActionIcon>
            }
          />
          <Group position="right" w="45%" pt="md">
            <Button
              variant="outline"
              size="xs"
              color="blue"
              onClick={() => {
                form.reset()
                close()
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="xs">
              Save
            </Button>
          </Group>
        </form>
      </AnnotationFormProvider>
    </>
  )
}

export default CreateForm
