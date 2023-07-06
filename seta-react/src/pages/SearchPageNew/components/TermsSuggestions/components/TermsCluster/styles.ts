import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { focusStyles, outlineTransition } from '~/styles'

export const root: ThemedCSS = theme => css`
  border-top: dashed 1px ${theme.colors.gray[3]};
  padding: ${theme.spacing.md} ${theme.spacing.sm};
  border-radius: ${theme.radius.sm};
  transition: ${outlineTransition}, border-radius 100ms ease;

  &.clickable {
    cursor: pointer;
  }

  &:first-of-type {
    border-top: 0;
    margin-top: ${theme.spacing.md};
  }

  &.clickable:hover {
    background-color: ${theme.colors.gray[1]};
    border-color: transparent;
  }

  &:hover + &,
  &:focus:focus-visible + & {
    border-color: transparent;
  }

  ${focusStyles(theme)}

  &:focus:focus-visible {
    outline-offset: -0.18rem;
    border-radius: ${theme.radius.lg};
  }

  outline-offset: -0.5rem;

  .seta-Checkbox-input {
    cursor: pointer;
  }
`

export const TermChip = styled.div(({ theme }) => {
  const defaultStyle = theme.fn.variant({ variant: 'outline', color: 'gray.4' })
  const hoverStyle = theme.fn.variant({ variant: 'outline', color: 'gray.5' })
  const checkedStyle = theme.fn.variant({ variant: 'filled', color: 'teal' })
  const defaultColor = theme.colors.dark[6]

  return css`
    color: ${defaultColor};
    background-color: white;
    border: 1px solid ${defaultStyle.border};
    padding: calc(${theme.spacing.xs} / 2) ${theme.spacing.md};
    border-radius: ${theme.radius.xl};
    transition: border-color 100ms ease, ${outlineTransition};
    cursor: pointer;

    &:hover:not([aria-checked='true']) {
      border-color: ${hoverStyle.border};
    }

    ${focusStyles(theme)}

    &&:active {
      transition: none;
      transform: translateY(0.0625rem);
      box-shadow: none;
    }

    &[aria-checked='true'] {
      color: ${checkedStyle.color};
      background-color: ${checkedStyle.background};
      border-color: ${checkedStyle.border};

      &:hover {
        background-color: ${checkedStyle.hover};
      }
    }
  `
})
