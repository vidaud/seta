import { css } from '@emotion/react'

import { CONTENT_MAX_WIDTH, pinnable } from '~/styles'

export const root: ThemedCSS = theme => css`
  .seta-Tabs-tabsList {
    ${pinnable}

    padding-top: ${theme.spacing.lg};
    background-color: ${theme.white};
    transition: box-shadow 0.2s ${theme.transitionTimingFunction},
      background-color 0.2s ${theme.transitionTimingFunction};

    .seta-Tabs-tab {
      transition: box-shadow 0.2s ${theme.transitionTimingFunction};
    }
  }

  &[data-pinned='true'] {
    .seta-Tabs-tabsList {
      box-shadow: ${theme.shadows.sm};
      background-color: ${theme.fn.rgba(theme.colors.gray[0], 0.95)};
      border-bottom-color: ${theme.colors.gray[4]};
      will-change: box-shadow, background-color;

      .seta-Tabs-tab {
        &::before {
          content: none;
        }

        will-change: box-shadow;

        &[data-active] {
          background-color: ${theme.white};
          box-shadow: 0 -0.0625rem 0.1875rem rgba(0, 0, 0, 0.04),
            rgba(0, 0, 0, 0.04) 0 -0.625rem 0.9375rem -0.3125rem,
            rgba(0, 0, 0, 0.03) 0 -0.4375rem 0.4375rem -0.3125rem;
        }

        &:not([data-active]) {
          background-color: transparent;
        }

        &:hover:not(:active):not([data-active]) {
          border-color: ${theme.colors.gray[4]};
          background-color: transparent;
        }
      }
    }
  }
`

export const tabsContainer = css`
  width: ${CONTENT_MAX_WIDTH};
  position: relative;
  display: flex;
  justify-content: center;
`

export const documentsIcon = css`
  margin-right: -1px;
  stroke-width: 10px;
  transform: scaleX(1.05);
`

export const stagedDocs = css`
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
`
