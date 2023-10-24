import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid ${theme.colors.gray[3]};
  border-radius: ${theme.radius.md};
  padding: 0;
  background-color: ${theme.white};
  overflow: hidden;

  .title {
    z-index: 1;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border-bottom: 1px solid ${theme.colors.gray[2]};

    will-change: box-shadow, border-color;
    transition: box-shadow 0.2s ${theme.transitionTimingFunction},
      border-color 0.2s ${theme.transitionTimingFunction};
  }

  [data-item] {
    margin-bottom: ${theme.spacing.sm};
  }

  &[data-scrolled='true'] {
    .title {
      box-shadow: ${theme.shadows.sm};
      border-bottom-color: ${theme.colors.gray[3]};
    }
  }
`

export const content: ThemedCSS = theme => css`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  padding-bottom: calc(${theme.spacing.lg} - ${theme.spacing.sm});
`

export const loaderWrapper = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 0.8;
`

export const scrollArea = css`
  flex-grow: 1;
  min-height: 0;
`
