import { css } from '@emotion/react'

export const tree: ThemedCSS = theme => css`
  background-color: ${theme.colors.gray[0]};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.radius.md};
`

export const node: ThemedCSS = theme => css`
  margin-right: ${theme.spacing.lg};
  color: ${theme.colors.gray[8]};
  white-space: nowrap;
  animation: taxonomy-node-slideRight 300ms 300ms ease forwards;

  &.leaf {
    color: ${theme.colors.gray[8]};
  }

  &:not(.leaf) {
    animation: taxonomy-node-slideRight 300ms ease forwards,
      taxonomy-node-fadeColor 300ms 300ms ease forwards;
  }

  // Giving it a more specific name as it gets scoped to the document
  @keyframes taxonomy-node-slideRight {
    0% {
      margin-left: 0;
      margin-right: ${theme.spacing.lg};
    }

    100% {
      margin-left: ${theme.spacing.lg};
      margin-right: 0;
    }
  }

  // Giving it a more specific name as it gets scoped to the document
  @keyframes taxonomy-node-fadeColor {
    0% {
      color: ${theme.colors.gray[8]};
    }

    100% {
      color: ${theme.colors.gray[6]};
    }
  }
`

export const rootNode: ThemedCSS = theme => css`
  &:not(.leaf) {
    margin-bottom: ${theme.spacing.xs};
  }

  &.leaf + :not(.leaf) {
    margin-top: ${theme.spacing.xs};
  }
`

export { Container } from '../../styles'
