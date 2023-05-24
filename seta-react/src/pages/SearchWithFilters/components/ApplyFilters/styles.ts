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
