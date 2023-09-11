import { css } from '@emotion/react'

export const folderIcon: ThemedCSS = theme => css`
  height: 20px;
  width: 18px;
  color: ${theme.colors.gray[6]};
  margin-top: -1px;
  flex-shrink: 0;
`

export const fileIcon: ThemedCSS = theme => css`
  font-size: 1.4rem;
  color: ${theme.colors.gray[5]};
  flex-shrink: 0;
`

export const path: ThemedCSS = theme => css`
  color: ${theme.colors.gray[5]};
  font-size: ${theme.fontSizes.md};

  & > div {
    & + div {
      &::before {
        content: '/';
        margin: 0 6px;
        color: ${theme.colors.gray[5]};
      }
    }

    &:last-of-type {
      color: ${theme.colors.dark[7]};
    }
  }
`
