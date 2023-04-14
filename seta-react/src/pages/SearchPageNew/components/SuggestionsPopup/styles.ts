import { css } from '@emotion/react'

export const popup: ThemedCSS = theme => css`
  border-color: ${theme.colors.gray[4]};

  .seta-Popover-arrow {
    border-color: inherit;

    // Must override the inline style
    left: 68px !important;
  }
`
