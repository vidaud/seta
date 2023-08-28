import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { keyframes } from '@mantine/core'

const PROGRESS_WIDTH = '60px'

const fill = keyframes({
  from: {
    width: 0
  }
})

const contentMarginLeft: ThemedCSS = theme => css`
  margin-left: calc(${PROGRESS_WIDTH} + ${theme.spacing.lg});
`

export const header: ThemedCSS = theme => css`
  display: grid;
  grid-template-columns: ${PROGRESS_WIDTH} 1fr;
  align-items: center;
  gap: ${theme.spacing.lg};

  position: relative;

  & .seta-Progress-bar {
    animation: ${fill} 300ms ease;
  }

  & .score {
    position: absolute;
    opacity: 0;
    visibility: hidden;
    left: calc(${PROGRESS_WIDTH} / 2);
    transform: translateX(-50%);
    margin-top: 0;
    width: ${PROGRESS_WIDTH};
    text-align: center;
    font-size: 0.65rem;
    color: ${theme.colors.gray[5]};
    cursor: default;
    transition: all 200ms ${theme.transitionTimingFunction};

    &:hover {
      color: ${theme.colors.gray[7]};
    }

    &.visible {
      opacity: 1;
      visibility: visible;
      margin-top: 2.5rem;
    }
  }
`

export const title: ThemedCSS = theme => css`
  overflow: hidden;
  color: ${theme.colors.dark[5]};
`

export const info: ThemedCSS = theme => css`
  ${contentMarginLeft(theme)}

  color: ${theme.colors.gray[6]};
  transition: margin-top 200ms ${theme.transitionTimingFunction};
`

export const infoOpen: ThemedCSS = theme => css`
  margin-top: ${theme.spacing.sm};
`

export const path: ThemedCSS = theme => css`
  color: ${theme.colors.gray[8]};
`

export const details: ThemedCSS = theme => css`
  ${contentMarginLeft(theme)};
`

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[0]};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
`
