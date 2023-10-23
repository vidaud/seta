import { css } from '@emotion/react'

export const item: ThemedCSS = theme => css`
  display: flex;
  align-items: center;
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.gray[3]};
  padding: 8px ${theme.spacing.sm};
  padding-left: 0;
  margin-bottom: ${theme.spacing.sm};
  background: ${theme.white};
  transition: background-color 0.2s ${theme.transitionTimingFunction},
    border-color 0.2s ${theme.transitionTimingFunction};
  left: auto !important;
  top: auto !important;
`

export const itemDragging: ThemedCSS = theme => css`
  background-color: ${theme.colors.gray[0]};
  border-color: ${theme.colors.gray[4]};
`

export const dragHandle: ThemedCSS = theme => css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${theme.colors.gray[5]};
  padding: 0 ${theme.spacing.sm};
  cursor: grab;
`

export const fieldInfo = css`
  flex: 1;
`
