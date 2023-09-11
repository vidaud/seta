import { css } from '@emotion/react'

import { slideDown } from '~/styles/keyframe-animations'

export const source: ThemedCSS = theme => css`
  padding: ${theme.spacing.md};
  background-color: ${theme.white};
  border: 1px solid ${theme.colors.gray[3]};
  border-radius: ${theme.radius.sm};
`

export const arrowDown: ThemedCSS = theme => css`
  color: ${theme.colors.gray[7]};
  opacity: 0;
  transform: translateY(-100%);
  animation: ${slideDown} 500ms ease forwards;
`
