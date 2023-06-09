import { css } from '@emotion/react'

const ID_WIDTH = '80px'
const HEADER_GAP = '1rem'

export const root: ThemedCSS = theme => css`
  border-radius: ${theme.radius.sm};
  transition: margin 0.2s ${theme.transitionTimingFunction};

  &[data-open='true']:not(:last-of-type) {
    margin-bottom: ${theme.spacing.md};
  }

  & + &[data-open='true'] {
    margin-top: ${theme.spacing.md};
  }
`

export const header: ThemedCSS = theme => css`
  display: grid;
  grid-template-columns: ${ID_WIDTH} 1fr auto;
  gap: ${HEADER_GAP};
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.radius.sm};
  cursor: pointer;

  .remove-button {
    visibility: hidden;
    font-size: 1.2em;

    &:hover {
      background-color: ${theme.colors.red[5]};
      color: ${theme.colors.red[0]};
    }
  }

  &:hover {
    background-color: ${theme.colors.gray[1]};

    .remove-button {
      visibility: visible;
    }
  }

  &:active {
    transform: translateY(1px);
  }

  &[data-open='true'] {
    transition: background-color 0.2s ${theme.transitionTimingFunction};
    background-color: ${theme.colors.gray[1]};

    &:hover {
      background-color: ${theme.colors.gray[2]};
    }

    .remove-button {
      visibility: visible;
    }
  }
`

export const icon: ThemedCSS = theme => css`
  color: ${theme.colors.gray[5]};
  font-size: 1.5rem;
`

export const details: ThemedCSS = theme => css`
  margin-left: calc(${ID_WIDTH} + ${HEADER_GAP} + ${theme.spacing.md});
  padding: 0 ${theme.spacing.md};
  border-left: 1px dashed ${theme.colors.gray[4]};

  & > div {
    padding-top: ${theme.spacing.md};
  }
`
