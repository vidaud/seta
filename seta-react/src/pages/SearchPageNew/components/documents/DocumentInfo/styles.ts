import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { keyframes } from '@mantine/core'

const PROGRESS_WIDTH = '60px'

const fill = keyframes({
  from: {
    width: 0
  }
})

export const root: ThemedCSS = theme => css`
  transition: padding-top 200ms ${theme.transitionTimingFunction},
    padding-bottom 200ms ${theme.transitionTimingFunction};

  &.open {
    margin: 0 -${theme.spacing.sm};
    padding: ${theme.spacing.sm};
    border-radius: ${theme.radius.sm};
    border: 1px solid ${theme.colors.gray[3]};

    & [data-details='true'] {
      border-color: transparent !important;
      transition: none !important;
    }

    & [data-info] {
      margin-top: ${theme.spacing.sm};
    }
  }
`

export const header: ThemedCSS = theme => css`
  display: grid;
  grid-template-columns: ${PROGRESS_WIDTH} 1fr auto;
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
    left: ${theme.spacing.sm};
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
  }

  &[data-open='true'] {
    & .score {
      opacity: 1;
      visibility: visible;
      margin-top: 2.5rem;
    }
  }

  &[data-details='true'] {
    cursor: pointer;
    margin: 0 -${theme.spacing.sm};
    padding: 0 ${theme.spacing.sm};
    border-radius: ${theme.radius.sm};
    border: 1px solid transparent;
    transition: border-color 200ms ${theme.transitionTimingFunction};

    &:hover {
      border-color: ${theme.colors.gray[3]};
    }

    &:active {
      transform: translateY(1px);
    }
  }
`

export const chevron: ThemedCSS = theme => css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.gray[7]};
  transition: transform 200ms ${theme.transitionTimingFunction};
  animation: fill 300ms ease;

  &.open {
    transform: rotate(180deg);
  }
`

export const title: ThemedCSS = theme => css`
  overflow: hidden;
  color: ${theme.colors.dark[5]};
`

const contentMarginLeft: ThemedCSS = theme => css`
  margin-left: calc(${PROGRESS_WIDTH} + ${theme.spacing.lg});
`

export const info: ThemedCSS = theme => css`
  color: ${theme.colors.gray[6]};
  ${contentMarginLeft(theme)};
  transition: margin-top 200ms ${theme.transitionTimingFunction};
`

export const path: ThemedCSS = theme => css`
  color: ${theme.colors.gray[8]};
`

export const details: ThemedCSS = theme => css`
  ${contentMarginLeft(theme)};

  // Set the margin on the inner div to prevent the content from "jumping" when the details are toggled
  & > div {
    margin-top: ${theme.spacing.lg};
  }
`

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[0]};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
`
