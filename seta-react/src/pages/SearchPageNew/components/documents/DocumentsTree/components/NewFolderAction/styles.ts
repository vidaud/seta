import { css } from '@emotion/react'

export const popover = css`
  padding: 0;
  border: none;
  width: 360px;
`

export const input: ThemedCSS = theme => css`
  width: 320px;

  .seta-Input-input {
    padding-right: 48px;

    &:focus {
      border-color: ${theme.colors.teal[6]};
    }
  }
`

export const saveButton = css`
  position: absolute;
  right: 0.5rem;
`
