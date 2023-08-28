import { css } from '@emotion/react'

export const noDocuments: ThemedCSS = theme => css`
  margin-top: ${theme.spacing.xl};
  padding: 3rem;

  .icon {
    color: ${theme.colors.gray[4]};
    font-size: 3rem;
  }
`

export const stagedDocs: ThemedCSS = theme => css`
  position: absolute;
  z-index: 1;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.md};
`
