import { css, keyframes } from '@emotion/react'

const textAreaEntry = keyframes({
  to: {
    marginBottom: '3rem'
  }
})

const actionsEntry = keyframes({
  to: {
    height: '2.5rem',
    opacity: 1
  }
})

export const root: ThemedCSS = theme => css`
  position: relative;
  cursor: text;
  border: 1px solid transparent;
  border-radius: ${theme.radius.md};
  transition: border-color 200ms ${theme.transitionTimingFunction},
    background-color 200ms ${theme.transitionTimingFunction};

  &:hover {
    border-color: ${theme.colors.gray[4]};
    background-color: ${theme.fn.lighten(theme.colors.gray[0], 0.05)};
  }
`

export const textArea: ThemedCSS = theme => css`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  animation: ${textAreaEntry} 200ms ${theme.transitionTimingFunction} forwards;

  .seta-Input-wrapper {
    flex: 1;
    display: flex;
    margin-bottom: 0;
  }

  .seta-Input-input {
    background-color: ${theme.colors.gray[1]};
    border-radius: ${theme.radius.md};
    transition: background-color 200ms ${theme.transitionTimingFunction},
      border-color 200ms ${theme.transitionTimingFunction};

    &:focus,
    &:focus-within {
      background-color: white;

      &:not([data-invalid]) {
        border-color: ${theme.colors.gray[5]};
      }
    }
  }

  .seta-Textarea-error {
    position: absolute;
    bottom: -1.75rem;
  }
`

export const actions: ThemedCSS = theme => css`
  position: absolute;
  right: calc(${theme.spacing.lg} + ${theme.spacing.sm});
  bottom: 1.25rem;
  height: 0;
  opacity: 0;
  overflow: hidden;
  animation: ${actionsEntry} 200ms ${theme.transitionTimingFunction} forwards;

  [data-cancel] {
    transition: all 200ms ${theme.transitionTimingFunction};
  }

  &[data-loading='true'] {
    [data-cancel] {
      opacity: 0;
      width: 0;
      padding: 0;
      margin-left: -1rem;
      pointer-events: none;
    }
  }
`
