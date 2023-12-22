import { useEffect, useState } from 'react'
import { Group, createStyles, Button, ActionIcon, ColorInput } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'

import {
  AnnotationFormProvider,
  useAnnotation
} from '~/pages/Admin/Annotations/contexts/annotation-context'

import { useUpdateAnnotation } from '~/api/admin/annotations'
import type { AnnotationResponse } from '~/api/types/annotations-types'
import { notifications } from '~/utils/notifications'

const useStyles = createStyles({
  input: {
    marginBottom: '20px'
  },
  form: {
    textAlign: 'left'
  }
})

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`

type Props = {
  annotation: AnnotationResponse
  close: () => void
  categories?: string[]
}

const UpdateForm = ({ annotation, close }: Props) => {
  const { classes, cx } = useStyles()
  const setUpdateAnnotationMutation = useUpdateAnnotation()
  const [color, onChange] = useState(annotation.color)

  const form = useAnnotation({
    initialValues: {
      label: '',
      color: annotation.color,
      category: ''
    },
    validate: {
      color: (value, values) =>
        values && values.color.length < 1
          ? `String should match pattern '^#(?:[0-9a-fA-F]{3}){1,2}$'"}`
          : null
    }
  })

  useEffect(() => {
    if (annotation) {
      form.setValues({
        label: annotation.label,
        color: color,
        category: annotation.category
      })
    }
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotation, color])

  const handleSubmit = (values: AnnotationResponse) => {
    const updatedValues = {
      label: values.label,
      color: values.color,
      category: values.category
    }

    setUpdateAnnotationMutation.mutate(updatedValues, {
      onSuccess: () => {
        notifications.showSuccess(`Annotation Updated Successfully!`, { autoClose: true })

        close()
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: () => {
        notifications.showError('Annotation update failed!', {
          autoClose: true
        })
      }
    })
  }

  return (
    <>
      <AnnotationFormProvider form={form}>
        <form className={cx(classes.form)} onSubmit={form.onSubmit(handleSubmit)}>
          <ColorInput
            placeholder="Pick color"
            label="Color"
            {...form.getInputProps('color')}
            value={color}
            onChange={onChange}
            rightSection={
              <ActionIcon onClick={() => onChange(randomColor())}>
                <IconRefresh size="1rem" />
              </ActionIcon>
            }
          />
          <Group position="right" pt="md">
            <Button
              variant="outline"
              size="xs"
              color="blue"
              onClick={e => {
                close()
                e.stopPropagation()
              }}
            >
              Cancel
            </Button>

            <Button size="xs" type="submit" onClick={e => e.stopPropagation()}>
              Update
            </Button>
          </Group>
        </form>
      </AnnotationFormProvider>
    </>
  )
}

export default UpdateForm
