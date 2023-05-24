import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  padding: 3rem 0;
  flex: 1;

  &.with-breadcrumbs {
    padding-top: 0;
  }
`

export const pageWrapper: ThemedCSS = theme => css`
  flex: 1;
`

export const contentWrapper: ThemedCSS = theme => css`
  flex: 1;
  /* padding-top: 2rem; */
`
