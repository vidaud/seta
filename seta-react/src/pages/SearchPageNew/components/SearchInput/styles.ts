import { css } from '@emotion/react'

const INPUT_HEIGHT = '44px'

export const leftButton = css`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  z-index: 1;
`

export const input = css`
  margin-left: -1px;
  margin-right: -1px;

  .seta-Input-input {
    height: ${INPUT_HEIGHT};
    border-radius: 0;
  }
`

export const rightButton = css`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  z-index: 1;
  height: ${INPUT_HEIGHT};
`
