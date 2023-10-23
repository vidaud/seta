import { css } from '@emotion/react'
import { createStyles } from '@mantine/core'

export const useStyles = createStyles(theme => ({
  button: {
    // position: 'fixed',
    // bottom: '2%',
    // right: '1%',
    // zIndex: 1000,
    padding: 0,
    borderColor: '#228be6',
    borderRadius: '50px',
    boxShadow: theme.shadows.sm
  },
  action: {
    border: 'none',
    position: 'fixed',
    bottom: '9.5%',
    right: '1%',
    zIndex: 1000,
    borderRadius: '50%',
    width: '25px',
    height: '25px'
  },
  message: {
    position: 'absolute',
    top: '15px'
  }
}))

export const pointer: ThemedCSS = () => css`
  scale: 0.7;
  color: '#228be6';
`

export const menuItem: ThemedCSS = () => css`
  padding: 0.625rem 0.75rem;
  cursor: pointer;
  border-radius: 0.25rem;
  color: '#000';
`
