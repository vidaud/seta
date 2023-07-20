import { css } from '@emotion/react'

export { Container } from '../../styles'

export const root: ThemedCSS = theme => css`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 3rem;

  [data-action-expand] {
    position: absolute;
    top: -${theme.spacing.xs};
    right: -${theme.spacing.md};
    margin: calc(${theme.spacing.xs} / 2);
    transition: all 100ms ${theme.transitionTimingFunction};
  }

  &:hover {
    [data-action-expand] {
      color: ${theme.colors.blue[5]};
      transform: scale(1.05);
      transform-origin: top right;

      &:hover {
        color: ${theme.colors.blue[0]};
        background-color: ${theme.colors.blue[5]};
        transition: none;
      }

      &:active {
        transform: scale(1.05) translateY(1px);
      }
    }
  }
`

export const quote: ThemedCSS = theme => css`
  position: absolute;
  line-height: 0;
  color: ${theme.colors.gray[3]};

  &.left {
    left: -8px;
    top: -8px;
  }

  &.right {
    right: -8px;
    bottom: -6px;
  }
`
