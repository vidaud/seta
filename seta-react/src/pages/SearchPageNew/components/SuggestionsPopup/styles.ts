import { css } from '@emotion/react'

export const popup: ThemedCSS = theme => css`
  border-color: ${theme.colors.gray[4]};
  min-height: 400px;
  padding: ${theme.spacing.sm};

  .seta-Popover-arrow {
    border-color: inherit;

    // Must override the inline style
    left: 68px !important;
  }
`

export const popupLeft: ThemedCSS = theme => css`
  flex: 0.3;
  padding-right: ${theme.spacing.sm};
`

export const popupRight: ThemedCSS = theme => css`
  flex: 0.7;
  padding-left: ${theme.spacing.sm};
`

export const closeButton = css`
  position: absolute;
  top: 0;
  right: 0;
`

export const inputWrapper: ThemedCSS = theme => css`
  width: 66vw;
  padding: ${theme.spacing.sm};
  padding-top: 0;
`
