import type { CSSObject } from '@emotion/styled'
import styled from '@emotion/styled'
import type { AccordionItemProps } from '@mantine/core'
import { Accordion } from '@mantine/core'

import { transientProps } from '~/utils/styled-utils'

type Props = AccordionItemProps & {
  $scrolled?: boolean
}

const AccordionItem = styled(
  Accordion.Item,
  transientProps
)<Props>(({ theme, $scrolled }) => {
  const scrolledStyles: CSSObject = $scrolled
    ? {
        boxShadow: theme.shadows.sm,
        borderBottomColor: theme.colors.gray[3]
      }
    : {}

  return {
    backgroundColor: theme.colors.gray[0],
    borderColor: theme.colors.gray[3],

    '.seta-Accordion-control': {
      position: 'relative',
      zIndex: 1,
      transition: `box-shadow 0.2s ${theme.transitionTimingFunction}, background-color 0.2s ${theme.transitionTimingFunction}`,

      '&:hover': {
        backgroundColor: theme.colors.gray[1],
        transition: 'none'
      }
    },

    '&[data-active="true"]': {
      borderColor: theme.colors.gray[3],
      boxShadow: theme.shadows.xs,

      '.seta-Accordion-control': {
        borderBottom: `1px solid ${theme.colors.gray[3]}`,
        ...scrolledStyles,

        '&:hover': {
          backgroundColor: 'transparent'
        }
      }
    }
  }
})

export default AccordionItem
