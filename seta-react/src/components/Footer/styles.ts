import { css } from '@emotion/react'

const sectionFont = css`
  font: normal normal 400 1rem/1.5rem arial, sans-serif;
`

export const footer: ThemedCSS = theme => css`
  background-color: ${theme.other.jrcBlue};
  height: auto;
  padding: 0 3%;
`

export const section: ThemedCSS = theme => css`
  width: 33.33%;
  padding: 1rem;

  li {
    font-size: 0.875rem;
    list-style: none;
    margin-bottom: 0;
    padding-inline-start: 0;
    color: white;

    & + li {
      margin-top: 0.5rem;
    }

    a {
      color: white;
    }
  }

  .title,
  .description,
  .header {
    ${sectionFont}
  }

  .title {
    font-weight: 700;
    color: white;
  }

  .description {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #d8e2ee;
    margin-top: 0;
  }

  .header {
    font-weight: 700;
    color: white;
    border-bottom-width: 2px;
    border-bottom: 1px solid ${theme.colors.gray[0]};
    padding-bottom: 0.5rem;
    margin-bottom: 0.75rem;
  }
`

export const withDivider: ThemedCSS = theme => css`
  border-top: 1px solid ${theme.colors.gray[0]};
`
