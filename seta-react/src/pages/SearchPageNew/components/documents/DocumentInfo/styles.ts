import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { keyframes } from '@mantine/core'

const PROGRESS_WIDTH = '60px'

const fill = keyframes({
  from: {
    width: 0
  }
})

export const header: ThemedCSS = theme => css`
  display: grid;
  grid-template-columns: ${PROGRESS_WIDTH} 1fr auto;
  align-items: center;
  gap: ${theme.spacing.lg};

  & .seta-Progress-bar {
    animation: ${fill} 300ms ease;
  }
`

export const chevron: ThemedCSS = theme => css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.gray[7]};
  transition: transform 200ms ${theme.transitionTimingFunction};
  animation: fill 300ms ease;
  cursor: pointer;

  &.open {
    transform: rotate(180deg);
  }
`

export const title: ThemedCSS = theme => css`
  overflow: hidden;
  color: ${theme.colors.dark[5]};

  &[data-details='true'] {
    cursor: pointer;
  }
`

const contentMarginLeft: ThemedCSS = theme => css`
  margin-left: calc(${PROGRESS_WIDTH} + ${theme.spacing.lg});
`

export const info: ThemedCSS = theme => css`
  color: ${theme.colors.gray[6]};
  ${contentMarginLeft(theme)};
`

export const path: ThemedCSS = theme => css`
  color: ${theme.colors.gray[8]};
`

export const details: ThemedCSS = theme => css`
  ${contentMarginLeft(theme)};
  margin-top: ${theme.spacing.lg};
  transition: margin 300ms ${theme.transitionTimingFunction};

  // Required to prevent the content from "jumping" when the details are hidden
  &[aria-hidden='true'] {
    margin-top: 0;
    margin-bottom: 0;
    display: block !important;
    visibility: hidden;
  }
`

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[0]};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
`
