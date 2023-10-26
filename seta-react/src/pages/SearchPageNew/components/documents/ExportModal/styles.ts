import { css } from '@emotion/react'

export const root = css`
  .seta-Paper-root {
    flex-basis: 60rem;
  }
`

export const content = css`
  height: 50vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 2rem;
  padding: 0.5rem 0.5rem;
`

export const format = css`
  grid-column: span 2;
`
