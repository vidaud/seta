import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-left: calc(-${theme.spacing.md} - 2px);
  padding: ${theme.spacing.xs} ${theme.spacing.xs};
  padding-left: ${theme.spacing.md};
  border-left: 3px solid transparent;
  border-top-right-radius: ${theme.radius.sm};
  border-bottom-right-radius: ${theme.radius.sm};
  cursor: pointer;

  [data-action-remove] {
    font-size: 1.2em;
  }

  &:hover {
    background-color: ${theme.colors.gray[1]};
    border-left-color: ${theme.colors.gray[4]};

    [data-action-view] {
      color: ${theme.colors.blue[5]};

      &:hover {
        color: ${theme.colors.blue[0]};
        background-color: ${theme.colors.blue[5]};
      }
    }

    [data-action-remove] {
      color: ${theme.colors.red[5]};

      &:hover {
        color: ${theme.colors.red[0]};
        background-color: ${theme.colors.red[5]};
      }
    }
  }

  &:active {
    transform: translateY(1px);
  }
`

export const icon: ThemedCSS = theme => css`
  color: ${theme.colors.gray[5]};
  font-size: 1.5rem;
`
