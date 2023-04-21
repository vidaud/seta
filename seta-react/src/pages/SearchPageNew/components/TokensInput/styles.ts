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
  right: 1px;
  line-height: calc(2.625rem - 2px);
  margin: 0 0.875rem;
  pointer-events: none;
  white-space: pre;
  overflow: hidden;

  span > span {
    display: inline-block;
    position: relative;
    transition: background-color 0.2s ease-in-out;
  }

  span.marker {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    opacity: 0;
    background-color: ${theme.fn.rgba(theme.colors.dark[2], 0.4)};
    transition: all 0.2s ease;
  }

  span.expression {
    .marker {
      opacity: 1;
      bottom: 4px;
      margin-left: 0.3rem;
      margin-right: 0.3rem;
    }
  }

  span.current {
    .highlighted {
      background-color: ${theme.fn.rgba(theme.colors.teal[2], 0.4)};
    }

    .marker {
      opacity: 1;
      height: 1px;
      background-color: ${theme.fn.rgba(theme.colors.teal[4], 0.7)};
    }
  }

  span.expression.current {
    .marker {
      bottom: 0;
      margin: 0;
    }
  }

  span.quote {
    color: ${theme.colors.grape[5]};
  }

  &.focused {
    span.current {
      .highlighted {
        background-color: ${theme.fn.rgba(theme.colors.teal[2], 0.3)};
      }

      .marker {
        bottom: 2px;
        height: 2px;
      }
    }
  }
`
