import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Chip as MantineChip } from '@mantine/core'

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

export const Chip = styled(MantineChip)(({ theme, color }) => {
  const checkedStyle = theme.fn.variant({ variant: 'filled', color })
  const defaultColor = theme.colors.dark[6]

  return css`
    .seta-Chip-label {
      color: ${defaultColor};
      transition: none;

      &[data-checked='true'] {
        color: ${checkedStyle.color};
        background-color: ${checkedStyle.background};
        transition: background-color 100ms ease;

        .seta-Chip-iconWrapper {
          color: ${checkedStyle.color};
        }

        &:hover {
          background-color: ${checkedStyle.hover};
        }
      }
    }
  `
})
