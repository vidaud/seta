import { css } from '@emotion/react'

export const chunkFilter = css`
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
`

export const dateFilter = css`
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
  padding-bottom: 1rem;
`

export const sourceChart: ThemedCSS = theme => css`
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
  border-top: 1px solid ${theme.colors.gray[3]};
`
