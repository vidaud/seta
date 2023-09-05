import { css } from '@emotion/react'

export const menu: ThemedCSS = theme => css`
  border: 1px solid ${theme.colors.gray[4]};

  .seta-Menu-itemIcon {
    font-size: 1.1rem;
  }

  .seta-Menu-itemLabel {
    font-size: 0.9rem;
  }
`
