import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  .seta-Tabs-tabsList {
    border-color: ${theme.colors.gray[4]};
  }

  .seta-Tabs-tab {
    font-size: ${theme.fontSizes.md};
    transition: border-color 0.2s ${theme.transitionTimingFunction},
      color 0.2s ${theme.transitionTimingFunction};

    .seta-Tabs-tabLabel {
      color: ${theme.colors.dark[4]};
    }

    .seta-ThemeIcon-root {
      transition: all 0.2s ${theme.transitionTimingFunction};
    }

    &:active {
      transform: translateY(1px);
    }

    &[data-active] {
      border-color: ${theme.colors.gray[4]};
      color: ${theme.colors.dark[9]};

      .seta-Tabs-tabLabel {
        color: ${theme.colors.dark[9]};
      }
    }

    &:not([data-active]) {
      border-color: transparent;

      &:hover:not(:active) {
        background-color: ${theme.colors.gray[0]};
      }
    }

    & + .seta-Tabs-tab {
      margin-left: ${theme.spacing.xs};
    }
  }
`
