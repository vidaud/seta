import { css } from '@emotion/react'

export const contentRoot = css`
  min-height: 40vh;

  .seta-SuggestionsError-root,
  .seta-SuggestionsLoading-root {
    padding-top: 3rem;
  }
`

export const tree: ThemedCSS = theme => css`
  padding: ${theme.spacing.md};
  background-color: ${theme.white};
  border: 1px solid ${theme.colors.gray[3]};
  border-radius: ${theme.radius.sm};
`
