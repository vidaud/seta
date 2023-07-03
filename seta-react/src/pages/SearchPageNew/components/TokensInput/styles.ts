import { css } from '@emotion/react'

export const container = css`
  position: relative;
`

export const input = css`
  width: 100%;

  .seta-TextInput-input {
    background: none;
  }
`

export const renderer: ThemedCSS = theme => css`
  position: absolute;
  top: 1px;
  bottom: 1px;
  left: 1px;
  right: 1px;
  line-height: calc(2.625rem - 2px);
  margin: 0 2.625rem 0 0.875rem;
  pointer-events: none;
  white-space: pre;
  overflow: hidden;
  color: transparent;
  background-color: transparent;

  span > span {
    display: inline-block;
    position: relative;
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  }

  span.marker {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    opacity: 0;
    background-color: ${theme.fn.rgba(theme.colors.dark[2], 0.4)};
    transition: all 0.2s ease-in-out;
  }

  span.expression {
    .marker {
      opacity: 1;
      bottom: 4px;
      margin-left: 0.3rem;
      margin-right: 0.3rem;
    }
  }

  span.current:not(.operator) {
    .highlighted {
      background-color: ${theme.fn.rgba(theme.colors.teal[2], 0.4)};
      color: ${theme.colors.teal[9]};

      .quote {
        background-color: transparent;
      }
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

  span.operator > span {
    position: relative;

    &::before {
      content: '';
      border-width: 1px;
      border-style: none solid;
      position: absolute;
      top: 0;
      bottom: 0;
      left: -1.5px;
      right: -1.5px;
    }
  }

  span.operator-and > span {
    color: ${theme.colors.grape[6]};
    background-color: ${theme.fn.lighten(theme.colors.grape[0], 0.4)};

    &::before {
      border-color: ${theme.fn.rgba(theme.colors.grape[5], 0.2)};
    }
  }

  span.operator-or > span {
    color: ${theme.colors.blue[6]};
    background-color: ${theme.fn.lighten(theme.colors.blue[0], 0.4)};

    &::before {
      border-color: ${theme.fn.rgba(theme.colors.blue[5], 0.2)};
    }
  }

  span.quote {
    color: ${theme.colors.gray[5]};
    background-color: ${theme.white};
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

      &.operator .highlighted {
        background-color: ${theme.fn.rgba(theme.colors.grape[0], 0.4)};
      }

      &.operator-or .highlighted {
        background-color: ${theme.fn.rgba(theme.colors.blue[0], 0.4)};
      }
    }

    span.operator-and > span {
      background-color: ${theme.colors.grape[0]};
    }

    span.operator-or > span {
      background-color: ${theme.colors.blue[0]};
    }
  }

  &.typing {
    span > span {
      transition: none;
      opacity: 0;
    }
  }
`

export const bg = css`
  position: absolute;
  z-index: -2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
`
