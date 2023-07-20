import { css } from '@emotion/react'

export const root = css`
  .seta-Modal-content {
    flex-basis: 70vw;
    min-width: 48rem;

    .seta-ScrollModal-content {
      min-height: 50vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .seta-ScrollArea-root {
      max-height: 75vh;
    }

    .seta-ScrollArea-scrollbar {
      z-index: 2000 !important;
    }
  }
`
