import { useEffect, useState } from 'react'
import type { AlertProps } from '@mantine/core'
import { Alert, Collapse } from '@mantine/core'

type Props = AlertProps

const ClosableAlert = (props: Props) => {
  const [visible, setVisible] = useState(false)

  // Make it visible after the first render
  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <Collapse in={visible}>
      <Alert {...props} withCloseButton onClose={() => setVisible(false)} />
    </Collapse>
  )
}

export default ClosableAlert
