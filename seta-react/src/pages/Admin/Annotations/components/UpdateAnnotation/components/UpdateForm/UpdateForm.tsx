import { useEffect, useState } from 'react'
import { TextInput, Group, createStyles, Button, ActionIcon, ColorInput } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'

import { AnnotationFormProvider, useAnnotation } from '~/pages/Admin/Annotations/annotation-context'

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

const UpdateForm = ({ annotation, close }) => {
  const { classes, cx } = useStyles()
  const setUpdateAnnotationMutation = useUpdateAnnotation()
  const [color, onChange] = useState(annotation.color_code)

  const form = useAnnotation({
    initialValues: {
      id: annotation.id,
      label: '',
      color_code: annotation.color_code,
      category_id: ''
    }
  })

  useEffect(() => {
    if (annotation) {
      form.setValues({
        id: annotation.id,
        label: annotation.label,
        color_code: color,
        category_id: annotation.category_id
      })
    }
    // adding form to useEffect will cause infinite loop call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotation])

  const handleSubmit = (values: AnnotationResponse) => {
    console.log(values)
    const updatedValues = {
      id: annotation.id,
      label: values.label,
      color_code: values.color_code,
      category_id: values.category_id
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
          <TextInput
            label="Label"
            {...form.getInputProps('label')}
            placeholder="Enter annotation label ..."
            className={cx(classes.input)}
            withAsterisk
          />
          <TextInput
            label="Category"
            {...form.getInputProps('category_id')}
            placeholder="Enter category ..."
            className={cx(classes.input)}
            withAsterisk
          />
          <ColorInput
            placeholder="Pick color"
            label="Your favorite color"
            value={color}
            onChange={onChange}
            rightSection={
              <ActionIcon onClick={() => randomColor()}>
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
