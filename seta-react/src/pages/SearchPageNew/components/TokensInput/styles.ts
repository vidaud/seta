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
  bottom: 1px;
  left: 1px;
  height: 2.625rem;
  line-height: calc(2.625rem - 0.125rem);
  padding-left: calc(2.625rem / 3);
  pointer-events: none;
  white-space: pre;

  span > span {
    display: inline-block;
    position: relative;
    transition: background-color 0.2s ease-in-out;
  }

  span.expression-marker {
    position: absolute;
    bottom: 2px;
    left: 0;
    right: 0;
    height: 1px;
    background-color: ${theme.fn.rgba(theme.colors.dark[2], 0.4)};
  }

  span.highlighted {
    background-color: ${theme.fn.rgba(theme.colors.teal[2], 0.4)};
    border-bottom: solid 2px ${theme.fn.rgba(theme.colors.teal[2], 0.7)};
  }

  span.quote {
    color: ${theme.colors.grape[5]};
  }
`
