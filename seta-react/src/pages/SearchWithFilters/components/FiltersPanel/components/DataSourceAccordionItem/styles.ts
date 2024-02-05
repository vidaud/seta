import { css } from '@emotion/react'

export const sourceChart: ThemedCSS = theme => css`
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  border-top: 1px solid ${theme.colors.gray[3]};
`
