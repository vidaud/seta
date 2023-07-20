import type { ComponentProps } from 'react'
import { Button } from '@mantine/core'

type Props = Omit<ComponentProps<typeof Button<'button'>>, 'color' | 'variant'>

const CancelButton = ({ children = 'Cancel', ...props }: Props) => {
  return (
    <Button color="gray.7" variant="light" {...props}>
      {children}
    </Button>
  )
}

export default CancelButton
