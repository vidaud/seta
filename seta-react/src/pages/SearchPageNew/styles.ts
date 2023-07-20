import { css } from '@emotion/react'

export const searchWrapper: ThemedCSS = theme => css`
  flex: 1;
  align-self: stretch;
  margin-top: ${theme.spacing.xs};
`

export const noDocuments: ThemedCSS = theme => css`
  margin-top: ${theme.spacing.xl};
  padding: 3rem;

  .icon {
    color: ${theme.colors.gray[4]};
    font-size: 3rem;
  }
`
