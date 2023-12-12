import { css } from '@emotion/react'

export const container: ThemedCSS = theme => css`
  position: relative;
  overflow: hidden;
  background-color: ${theme.white};
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.gray[4]};
  margin: 0 auto;
  max-height: 25rem;
  min-width: 10rem;
  width: 100%;
  align-self: stretch;

  /* Simulate scroll shadow */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(180deg, ${theme.colors.gray[4]} 0%, transparent 100%);
    opacity: 0;
    pointer-events: none;
    z-index: 1;
    transition: opacity 200ms ${theme.transitionTimingFunction};
  }

  &[data-scrolled='true']::before {
    opacity: 0.5;
  }
`

export const group: ThemedCSS = theme => css`
  margin: 0 ${theme.spacing.md};

  &:first-of-type {
    margin-top: ${theme.spacing.md};
  }

  &:last-of-type {
    margin-bottom: ${theme.spacing.md};
  }
`
