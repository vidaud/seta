import { css } from '@emotion/react'

const EXPAND_TRANSITION_TIME = '300ms'

export const root: ThemedCSS = theme => css`
  flex: 1;
  padding: ${theme.spacing.lg};

  &[data-docs='true'] {
    padding: 0 ${theme.spacing.xs};
  }
`

export const uploads: ThemedCSS = theme => css`
  flex: 1;
  display: grid;
  gap: calc(${theme.spacing.lg} + ${theme.spacing.sm});
  grid-template-columns: 1fr auto 1fr;
  transition: ${EXPAND_TRANSITION_TIME} ${theme.transitionTimingFunction};
`

export const uploadingDocs = css`
  grid-template-columns: 1fr auto 0fr;
  gap: 0;
`

export const uploadingText = css`
  grid-template-columns: 0fr auto 1fr;
  gap: 0;
`

export const zeroWidth: ThemedCSS = theme => css`
  transition: all ${EXPAND_TRANSITION_TIME} ${theme.transitionTimingFunction};
  white-space: nowrap;
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  margin-right: 0;
  opacity: 0;
  border-width: 0;
  pointer-events: none;
  overflow: hidden;
`

export const orDivider: ThemedCSS = theme => css`
  position: relative;

  &::after {
    content: 'OR';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(270deg);
    background-color: white;
    font-size: 1rem;
    line-height: 1;
    padding: 0 ${theme.spacing.xs};
    color: ${theme.colors.gray[4]};
  }
`
