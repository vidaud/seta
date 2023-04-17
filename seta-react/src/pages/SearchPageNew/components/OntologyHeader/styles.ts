import { css } from '@emotion/react'

const SELECTORS_WIDTH = '100px'

export const left: ThemedCSS = theme => css`
  width: ${SELECTORS_WIDTH};
`

export const checkbox = css`
  .seta-Checkbox-input {
    cursor: pointer;
  }
`

export const relatedSelector = css`
  margin-left: -${SELECTORS_WIDTH};
`
