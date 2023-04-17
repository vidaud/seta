import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  ${theme.fn.fontStyles()}

  font-size: ${theme.fontSizes.sm};
  text-align: left;

  border: 0;
  outline: 0;
  background-color: transparent;
  width: 100%;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.radius.sm};
  cursor: pointer;

  color: ${theme.colors.dark[9]};

  &.selected {
    background-color: ${theme.colors.gray[1]};
  }
`
