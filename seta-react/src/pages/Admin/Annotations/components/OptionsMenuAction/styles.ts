import { css } from '@emotion/react'

import { CONTENT_MAX_WIDTH } from '~/styles'

const POPUP_HEIGHT = '500px'

export const popup: ThemedCSS = theme => css`
  border-color: ${theme.colors.gray[4]};
  height: ${POPUP_HEIGHT};
  padding: ${theme.spacing.sm};

  .seta-Popover-arrow {
    border-color: inherit;
    transition: left 0.2s ease;

    // Must override the inline style
    left: 68px !important;
  }

  &[data-target='upload'] {
    .seta-Popover-arrow {
      left: 15px !important;
    }
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
  z-index: 1;
`

export const inputWrapper = css`
  width: ${CONTENT_MAX_WIDTH};
  padding: 0;
`
