import { css } from '@emotion/react'

export const container = css`
  display: flex;
  flex-direction: column;
`

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
