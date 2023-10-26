import { css } from '@emotion/react'

const ICON_MARGIN = '0.35rem'

export const root: ThemedCSS = theme => css`
  padding: 0;
  height: auto;

  .seta-Button-leftIcon {
    margin-right: ${ICON_MARGIN};
  }

  .seta-Button-rightIcon {
    margin-left: ${ICON_MARGIN};
  }
`
