import { css } from '@emotion/react'

import { CONTENT_MAX_WIDTH } from '~/styles'

export const root: ThemedCSS = theme => css`
  max-width: ${CONTENT_MAX_WIDTH};
  position: relative;
  padding: ${theme.spacing.lg} 0;
  margin-left: auto;
  margin-right: auto;
`

export const content = css`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
