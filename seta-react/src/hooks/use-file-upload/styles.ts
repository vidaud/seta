import { css } from '@emotion/react'

export const dropzone: ThemedCSS = theme => css`
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: transparent;
  border-radius: ${theme.radius.md};
  transition: border-color 200ms ${theme.transitionTimingFunction},
    background-color 200ms ${theme.transitionTimingFunction};

  &:hover {
    border-color: ${theme.colors.gray[4]};
  }

  &[data-accept='true'] {
    border-color: ${theme.colors.teal[6]};
    background-color: ${theme.colors.teal[0]};
  }
`

export const dropzoneHighlight: ThemedCSS = theme => css`
  border-color: ${theme.colors.yellow[6]};
  background-color: ${theme.colors.yellow[0]};
`

export const dropzoneUploading = css`
  pointer-events: none;
`

export const icon: ThemedCSS = theme => css`
  color: ${theme.colors.gray[6]};
  font-size: 3.5rem;
  margin-bottom: ${theme.spacing.lg};
`

export const iconAccept: ThemedCSS = theme => css`
  color: ${theme.colors.teal[6]};
`

export const iconReject: ThemedCSS = theme => css`
  color: ${theme.colors.red[6]};
`

export const progress = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 2px;
  background-color: white;

  .seta-Progress-root {
    width: 50%;
  }
`
