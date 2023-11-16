import type { CSSObject } from '@emotion/react'
import styled from '@emotion/styled'
import type { AccordionPanelProps } from '@mantine/core'
import { Accordion } from '@mantine/core'

import { transientProps } from '~/utils/styled-utils'

type Props = AccordionPanelProps & {
  $withScrollArea?: boolean
}

const AccordionPanel = styled(
  Accordion.Panel,
  transientProps
)<Props>(({ theme, $withScrollArea }) => {
  const contentStyle: CSSObject = $withScrollArea
    ? { padding: `0` }
    : { padding: `${theme.spacing.md} ${theme.spacing.xs}` }

  const scrollAreaStyle: CSSObject = $withScrollArea
    ? {
        '.seta-ScrollArea-viewport': {
          padding: `${theme.spacing.md} 1.5rem`
        }
      }
    : {}

  return {
    '.seta-Accordion-content': {
      ...contentStyle
    },

    ...scrollAreaStyle
  }
})

export default AccordionPanel
