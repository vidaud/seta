import { css } from '@emotion/react'

const actionVisible = css`
  visibility: visible;
  opacity: 1;
  pointer-events: all;
  width: 1.75rem;
  min-width: 1.75rem;
`

export const root: ThemedCSS = theme => css`
  position: relative;

  transition: padding-top 200ms ${theme.transitionTimingFunction},
    padding-bottom 200ms ${theme.transitionTimingFunction};

  .seta-ActionsGroup-root {
    transition: all 200ms ${theme.transitionTimingFunction};

    & .seta-ActionIcon-root {
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      width: 0;
      min-width: 0;

      &[data-toggled] {
        ${actionVisible}
      }
    }
  }

  &:hover,
  &.open {
    .seta-ActionsGroup-root .seta-ActionIcon-root {
      ${actionVisible}
    }
  }

  &.open {
    margin: 0 -${theme.spacing.sm};
    padding: ${theme.spacing.sm};
    border-radius: ${theme.radius.sm};
    border: 1px solid ${theme.colors.gray[3]};
    box-shadow: ${theme.shadows.xs};

    [data-details] {
      border-color: transparent !important;
      transition: none !important;
    }

    .seta-ActionsGroup-root {
      margin-right: ${theme.spacing.xs};
      background-color: ${theme.white};
    }
  }
`

export const header: ThemedCSS = theme => css`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: ${theme.spacing.lg};

  position: relative;

  &[data-details] {
    cursor: pointer;
    margin: 0 -${theme.spacing.sm};
    padding: 0 ${theme.spacing.sm};
    border-radius: ${theme.radius.sm};
    border: 1px solid transparent;
    transition: border-color 200ms ${theme.transitionTimingFunction};

    &:hover {
      border-color: ${theme.colors.gray[3]};
    }

    &:active:not(:focus-within) {
      transform: translateY(1px);
    }
  }
`

export const details: ThemedCSS = theme => css`
  // Set the margin on the inner div to prevent the content from "jumping" when the details are toggled
  & > div {
    margin-top: ${theme.spacing.lg};
  }
`
