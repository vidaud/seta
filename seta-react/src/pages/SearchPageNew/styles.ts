import { css } from '@emotion/react'

export const searchWrapper = css`
  flex: 1;
`

export const noDocuments: ThemedCSS = theme => css`
  margin-top: ${theme.spacing.xl};
  padding: 3rem;

  .icon {
    color: ${theme.colors.gray[4]};
    font-size: 3rem;
  }
`
