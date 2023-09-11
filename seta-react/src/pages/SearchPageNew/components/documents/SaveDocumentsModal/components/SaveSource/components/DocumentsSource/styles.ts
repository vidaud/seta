import { css } from '@emotion/react'
import { createStyles } from '@mantine/core'

export const fileIcon: ThemedCSS = theme => css`
  font-size: 1.4rem;
  color: ${theme.colors.gray[5]};
  flex-shrink: 0;
`

export const docsInfoStyles = createStyles(() => ({
  dropdown: {
    padding: 0
  }
}))
