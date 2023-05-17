import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const root: ThemedCSS = theme => css`
  border-top: dashed 1px ${theme.colors.gray[3]};
  padding: ${theme.spacing.md} ${theme.spacing.sm};
  border-radius: ${theme.radius.sm};

  &.clickable {
    cursor: pointer;
  }

  &:first-of-type {
    border-top: 0;
  }

  &.clickable:hover {
    background-color: ${theme.colors.gray[1]};
    border-color: transparent;
  }

  &:hover + & {
    border-color: transparent;
  }

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
    transition: border-color 100ms ease;
    cursor: pointer;

    &:hover:not([data-selected='true']) {
      border-color: ${hoverStyle.border};
    }

    &&:active {
      transition: none;
      transform: translateY(0.0625rem);
      box-shadow: none;
    }

    &[data-selected='true'] {
      color: ${checkedStyle.color};
      background-color: ${checkedStyle.background};
      border-color: ${checkedStyle.border};

      &:hover {
        background-color: ${checkedStyle.hover};
      }
    }
  `
})
