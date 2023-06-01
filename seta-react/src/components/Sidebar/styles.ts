import { css } from '@emotion/react'

export const wrapper = css`
  position: sticky;
  top: 0;
  align-self: stretch;
`

export const sidebar: ThemedCSS = theme => css`
  position: sticky;
  top: 0;
  margin: -3rem 0;
  min-width: 25rem;
  max-height: 100vh;
  height: auto;
  flex: 1;
  border-color: ${theme.colors.gray[2]};
  background-color: ${theme.fn.rgba(theme.colors.gray[0], 1)};
`

export const mainSection: ThemedCSS = theme => css`
  padding: 2rem ${theme.spacing.xl};
`