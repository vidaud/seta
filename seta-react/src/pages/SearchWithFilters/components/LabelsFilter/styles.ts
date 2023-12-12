import { css } from '@emotion/react'

const POPUP_HEIGHT = '200px'

export const searchContainer: ThemedCSS = theme => css`
  z-index: 1;
  position: relative;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${theme.colors.gray[3]};

  transition: box-shadow 200ms ${theme.transitionTimingFunction},
    border-color 200ms ${theme.transitionTimingFunction};

  &[data-scrolled='true'] {
    box-shadow: ${theme.shadows.sm};
    border-bottom-color: ${theme.colors.gray[3]};
  }
`

export const searchInput = css`
  flex: 1;

  .seta-TextInput-input {
    border: none;
  }
`

export const popup: ThemedCSS = theme => css`
  border-color: ${theme.colors.gray[4]};
  height: ${POPUP_HEIGHT};
  padding: ${theme.spacing.sm};
`

export const closeButton = css`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`
