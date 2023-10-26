import type { ComponentPropsWithRef } from 'react'
import { Button } from '@mantine/core'

import * as S from './styles'

// Can't use Mantine's ButtonProps because it doesn't expose the base events
type ButtonProps = ComponentPropsWithRef<typeof Button<'button'>>

type Props = Omit<ButtonProps, 'radius | variant'>

const ActionLink = (props: Props) => {
  return <Button {...props} variant="white" css={S.root} />
}

export default ActionLink
