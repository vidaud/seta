import { css } from '@emotion/react'
import { createStyles } from '@mantine/core'

const FOLDER_ICON_HEIGHT = '20px'

export const rootNode = css`
  margin-left: 0;
`

export const node: ThemedCSS = theme => css`
  margin-left: ${theme.spacing.sm};
  white-space: nowrap;
  position: relative;
`

export const expanded: ThemedCSS = theme => css`
  &:not([data-root])::before {
    content: '';
    position: absolute;
    left: 1px;
    top: 3.3rem;
    bottom: 0.2rem;
    width: 1px;
    background-color: ${theme.colors.gray[3]};
    transition: background-color 200ms ease;
  }

  & [data-node]:hover::before {
    background-color: ${theme.colors.blue[3]};
  }
`

export const itemContainer: ThemedCSS = theme => css`
  position: relative;
  display: grid;
  grid-template-columns: 14px 20px 1fr;
  align-items: center;
  gap: 6px;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.radius.sm};
  border: 1px solid transparent;
  cursor: pointer;

  [data-actions] {
    display: none;

    & > .seta-Group-root {
      padding: 0;
    }
  }

  &:hover {
    background-color: ${theme.colors.gray[1]};

    [data-actions] {
      display: block;
    }
  }

  &:active:not(:focus-within) {
    transform: translateY(1px);
  }

  &[data-top-actions] [data-actions] {
    display: block;
  }
`

export const editing: ThemedCSS = theme => css`
  background-color: ${theme.colors.gray[1]};

  [data-actions] {
    display: block;
  }
`

export const selected: ThemedCSS = theme => css`
  background-color: ${theme.colors.blue[0]} !important;
  border: 1px solid ${theme.colors.blue[2]};
`

export const disabled: ThemedCSS = theme => css`
  color: ${theme.colors.gray[7]};
  border: 1px dashed ${theme.colors.gray[5]};
  opacity: 0.5;
  pointer-events: none;
`

export const icon: ThemedCSS = theme => css`
  color: ${theme.colors.gray[6]};
  font-size: 1.15rem;
  line-height: 0;
  grid-column: 2;
  justify-self: center;
  margin-right: 2px;
`

export const fileIcon: ThemedCSS = theme => css`
  font-size: 1.4rem;
  color: ${theme.colors.gray[5]};
`

export const folderIcon = css`
  height: ${FOLDER_ICON_HEIGHT};
  margin-top: -1px;
`

export const folderOpenIcon = css`
  height: ${FOLDER_ICON_HEIGHT};
  font-size: 1.3rem;
  margin-left: 3px;
  margin-top: -1px;
`

export const titleContainer = css`
  overflow: hidden;
`

export const title = css`
  flex: 1;
  line-height: 1.8;
  overflow: hidden;
  text-overflow: ellipsis;
`

// Must define it with `createStyles` to get the styles applied correctly when rendered 'withinPortal'
export const tooltipStyles = createStyles(() => ({
  tooltip: {
    maxWidth: 300,
    whiteSpace: 'normal'
  }
}))
