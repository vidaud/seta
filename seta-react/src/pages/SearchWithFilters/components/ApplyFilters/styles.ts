import { css } from '@emotion/react'
import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => {
  const borderColor = theme.colors.gray[4]

  return {
    dropdown: {
      borderColor
    },

    arrow: {
      borderColor
    }
  }
})

export const buttonInactive: ThemedCSS = theme => css`
  && {
    background-color: ${theme.colors.gray[0]};
    border-color: ${theme.colors.blue[4]};
    border-style: dashed;
  }
`
