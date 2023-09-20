import { css } from '@emotion/react'

import { outlineTransition } from '~/styles'

const GAP = '2rem'

export const root: ThemedCSS = theme => css`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: ${GAP};
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.radius.sm};
  transition: ${outlineTransition}, margin 0.2s ${theme.transitionTimingFunction};
  cursor: pointer;

  [data-action='remove'] {
    visibility: hidden;
    font-size: 1.2em;

    &:hover {
      background-color: ${theme.colors.red[5]};
      color: ${theme.colors.red[0]};
    }
  }

  &:hover,
  &:focus:focus-visible {
    background-color: ${theme.colors.gray[1]};

    [data-action='remove'] {
      visibility: visible;
    }
  }

  &:active:not(:focus-within) {
    transform: translateY(1px);
  }
`

export const checkbox = css`
  .seta-Checkbox-input {
    cursor: pointer;
  }
`

export const icon: ThemedCSS = theme => css`
  color: ${theme.colors.gray[5]};
  font-size: 1.5rem;
`

export const title = css`
  overflow: hidden;
`
