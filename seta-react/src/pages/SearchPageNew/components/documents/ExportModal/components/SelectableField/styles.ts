import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  display: grid;
  grid-template-columns: 1fr 24px;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 8px ${theme.spacing.md};
  padding-right: ${theme.spacing.sm};
  border-radius: ${theme.radius.sm};
  overflow: hidden;
  margin-bottom: ${theme.spacing.sm};
  cursor: pointer;
  max-height: 200px;

  transition: max-height 0.2s ${theme.transitionTimingFunction},
    padding 0.2s ${theme.transitionTimingFunction}, margin 0.2s ${theme.transitionTimingFunction},
    opacity 0.2s ${theme.transitionTimingFunction};

  [data-icon] {
    display: none;
  }

  &:hover {
    background-color: ${theme.colors.gray[1]};

    [data-icon] {
      display: block;
    }
  }

  &:active {
    transform: translateY(1px);
  }

  &[aria-checked='true'] {
    transition: all 0.2s ${theme.transitionTimingFunction};
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    transform: translateX(1rem);
  }
`

export const rightIcon: ThemedCSS = theme => css`
  color: ${theme.colors.blue[4]};
  flex-shrink: 0;
`
