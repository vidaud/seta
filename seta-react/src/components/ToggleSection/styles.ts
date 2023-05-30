import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  transition: margin 0.2s ${theme.transitionTimingFunction};

  &[data-open='true']:not(:last-of-type) {
    margin-bottom: ${theme.spacing.md};
  }

  & + &[data-open='true'] {
    margin-top: ${theme.spacing.md};
  }
`

export const button: ThemedCSS = theme => css`
  display: 'block';
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  color: ${theme.colors.gray[8]};
  border: 1px solid transparent;
  border-style: solid none;
  font-size: ${theme.fontSizes.sm};
  transition: background-color 0.2s ${theme.transitionTimingFunction},
    color 0.2s ${theme.transitionTimingFunction};

  &:hover {
    background-color: ${theme.colors.gray[2]};
    color: ${theme.black};
  }

  &:active {
    transform: translateY(1px);
  }

  &[data-open='true'] {
    background-color: ${theme.white};
    color: ${theme.black};
    border-color: ${theme.colors.gray[2]};
  }

  &[disabled] {
    pointer-events: none;
    color: ${theme.colors.gray[5]};

    .seta-ThemeIcon-root {
      color: ${theme.colors.gray[5]};
      border-color: ${theme.colors.gray[5]};
    }
  }

  .seta-ThemeIcon-root {
    transition: all 0.2s ${theme.transitionTimingFunction};
  }
`

export const chevron: ThemedCSS = theme => css`
  transition: transform 0.2s ${theme.transitionTimingFunction};

  &[data-open='true'] {
    transform: rotate(90deg);
  }
`

export const content: ThemedCSS = theme => css`
  background-color: ${theme.white};

  & > div {
    padding: ${theme.spacing.lg} ${theme.spacing.md};
    border-bottom: 1px solid ${theme.colors.gray[2]};
  }
`

export const marker = css`
  .seta-Indicator-indicator {
    margin-top: 2px;
    margin-right: -4px;
  }
`
