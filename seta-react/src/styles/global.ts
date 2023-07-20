/// Use this file to add global styles to the project ///

import { css } from '@emotion/react'
import type { CSSObject, MantineTheme } from '@mantine/core'

export const PAGE_PADDING = '2rem'

export const CONTENT_MAX_WIDTH = '66vw'

export const outlineTransition = 'outline-color 100ms ease, outline-offset 100ms ease'

export const unfocusedOutlineStyles = css`
  outline-offset: 0;
  outline: 0.125rem solid transparent;
`

export const focusedOutlineStyles: ThemedCSS = theme => css`
  outline-offset: 0.125rem;
  outline: 0.125rem solid ${theme.colors[theme.primaryColor][5]};
`

export const focusStyles: ThemedCSS = theme => css`
  -webkit-tap-highlight-color: transparent;
  ${unfocusedOutlineStyles}

  &:focus {
    ${focusedOutlineStyles(theme)}

    &:not(:focus-visible) {
      outline-color: transparent;
    }
  }
`

export const rowFocusStyles: ThemedCSS = theme => css`
  ${focusStyles(theme)}

  &:focus:focus-visible {
    outline-offset: -0.18rem;
    border-radius: ${theme.radius.md};
  }

  outline-offset: -0.5rem;
`

export const unfocusedOutlineStylesObject: CSSObject = {
  outlineOffset: '0',
  outline: '0.125rem solid transparent'
}

export const focusStylesObject: CSSObject = {
  '&:focus': {
    transition: outlineTransition
  },

  ...unfocusedOutlineStylesObject
}

export const focusedOutlineStylesObject = (theme: MantineTheme): CSSObject => ({
  outlineOffset: '0.125rem',
  outline: `0.125rem solid ${theme.colors[theme.primaryColor][5]}`
})

export const pinnable = css`
  position: sticky;
  top: -1px;
  z-index: 10;
`
