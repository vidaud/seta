import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  background-color: ${theme.colors.gray[0]};
  border-radius: ${theme.radius.md};
  border: 1px dashed ${theme.colors.gray[4]};
  padding: ${theme.spacing.sm};
  padding-top: ${theme.spacing.lg};
  margin: ${theme.spacing.sm} ${theme.spacing.md};
  white-space: normal;
  position: relative;
`

export const icon: ThemedCSS = theme => css`
  color: ${theme.colors.gray[6]};
  opacity: 0.8;
`

export const folderIcon = css`
  font-size: 1.2rem;
  line-height: 0;
  scale: 1.25;
`

export const arrow: ThemedCSS = theme => css`
  position: absolute;
  scale: 0.8;
  right: -20px;
  top: -22px;
  color: ${theme.colors.teal[6]};
  stroke: ${theme.colors.teal[8]};
`
