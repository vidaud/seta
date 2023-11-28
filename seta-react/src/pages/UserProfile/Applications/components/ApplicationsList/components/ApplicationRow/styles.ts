import { css } from '@emotion/react'

// const PROGRESS_WIDTH = '40px'

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

// const contentMarginLeft: ThemedCSS = theme => css`
//   margin-left: calc(${PROGRESS_WIDTH} + ${theme.spacing.lg});
//   // margin-left: ${theme.spacing.lg};
// `

export const details: ThemedCSS = theme => css`
  // Set the margin on the inner div to prevent the content from "jumping" when the details are toggled
  & > div {
    margin-top: ${theme.spacing.lg};
  }
`
