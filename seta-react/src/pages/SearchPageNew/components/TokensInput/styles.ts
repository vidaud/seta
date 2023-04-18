import { css } from '@emotion/react'

export const container = css`
  position: relative;
`

export const input = css`
  width: 100%;

  .seta-TextInput-input {
    color: transparent;
    caret-color: black;
  }
`

export const renderer: ThemedCSS = theme => css`
  position: absolute;
  top: 1px;
  left: 1px;
  height: 2.625rem;
  line-height: calc(2.625rem - 0.125rem);
  padding-left: calc(2.625rem / 3);
  pointer-events: none;

  span {
    display: inline-block;
  }

  span.highlighted {
    background-color: hsl(128deg 92% 71% / 35%);
  }
`
