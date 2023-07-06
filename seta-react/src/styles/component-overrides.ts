import type { MantineThemeOverride } from '@mantine/core'

import { focusStylesObject, outlineTransition, unfocusedOutlineStylesObject } from '~/styles/global'

const componentOverrides: MantineThemeOverride['components'] = {
  Chip: {
    styles: {
      root: {
        '&:active': {
          transform: 'translateY(0.0625rem)'
        }
      },

      input: {
        '&:focus + .seta-Chip-label': {
          transition: outlineTransition
        },

        '&:focus:focus:not(:focus-visible) + .seta-Chip-label': {
          // Override the default Mantine style
          ...unfocusedOutlineStylesObject
        }
      },

      label: {
        ...unfocusedOutlineStylesObject
      }
    }
  },

  ScrollArea: {
    defaultProps: {
      type: 'hover'
    },
    styles: theme => ({
      scrollbar: {
        transition: 'opacity .2s ease .2s, transform .2s ease, background-color .2s ease',

        '.seta-ScrollArea-thumb': {
          transition: 'background-color .2s ease'
        },

        '&[data-orientation="horizontal"]': {
          transformOrigin: 'center bottom'
        },

        '&[data-orientation="vertical"]': {
          transformOrigin: 'right center'
        },

        '&[data-state="hidden"]': {
          opacity: 0,
          display: 'block !important',
          pointerEvents: 'none'
        },

        '&[data-state="visible"]': {
          opacity: 1,
          pointerEvents: 'all',

          '&:hover': {
            transition: 'opacity .2s ease, transform .2s ease, background-color .2s ease',
            backgroundColor: theme.fn.rgba(theme.colors.gray[1], 0.8),

            '&[data-orientation="horizontal"]': {
              transform: 'scaleY(1.4)'
            },

            '&[data-orientation="vertical"]': {
              transform: 'scaleX(1.4)'
            },

            '.seta-ScrollArea-thumb': {
              backgroundColor: theme.fn.rgba(theme.black, 0.45)
            }
          }
        }
      }
    })
  },

  Tooltip: {
    defaultProps: {
      openDelay: 200
    }
  },

  UnstyledButton: {
    styles: {
      root: {
        ...focusStylesObject
      }
    }
  },

  Dropzone: {
    styles: {
      root: {
        ...focusStylesObject
      }
    }
  }
}

export default componentOverrides
