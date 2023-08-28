import type { ReactNode } from 'react'
import type { MantineTransition } from '@mantine/core'
import { Transition } from '@mantine/core'

import * as S from './styles'

type Props = {
  toggled?: boolean
  toggledElement: ReactNode
  children: ReactNode
  transition?: MantineTransition
  transitionIn?: MantineTransition
  transitionOut?: MantineTransition
  duration?: number
  durationIn?: number
  durationOut?: number
}

const ToggleTransition = ({
  toggled = false,
  toggledElement,
  transition = 'scale',
  transitionIn = transition,
  transitionOut = transition,
  duration,
  durationIn = duration,
  durationOut = duration,
  children
}: Props) => {
  const content = (
    <Transition mounted={!toggled} transition={transitionOut} duration={durationOut}>
      {styles => (
        <div css={S.element} style={styles}>
          {children}
        </div>
      )}
    </Transition>
  )

  const toggledContent = (
    <Transition mounted={toggled} transition={transitionIn} duration={durationIn}>
      {styles => (
        <div css={S.element} style={styles}>
          {toggledElement}
        </div>
      )}
    </Transition>
  )

  return (
    <div css={S.root}>
      {content}
      {toggledContent}
    </div>
  )
}

export default ToggleTransition
