import { css } from '@emotion/react'

const POPUP_HEIGHT = '500px'

export const popup: ThemedCSS = theme => css`
  display: flex;
  border-color: ${theme.colors.gray[4]};
  height: ${POPUP_HEIGHT};
  padding: ${theme.spacing.sm};

  .seta-Popover-arrow {
    border-color: inherit;
  }

  & > div {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`

export const closeButton = css`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`
