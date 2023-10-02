import type { NotificationProps } from '@mantine/notifications'

import type { NotificationType } from './common'
import { SVG_SCALE, ANIMATION, COLOR } from './common'

export const getStyles = (type: NotificationType): NotificationProps['styles'] => {
  const color = COLOR[type]
  const svgScale = SVG_SCALE[type]
  const animation = ANIMATION[type]

  return theme => ({
    root: {
      borderColor: theme.colors[color][6],
      backgroundColor: theme.colors[color][0],
      boxShadow: '3px 3px 6px 0px rgba(0,0,0, 0.2)',
      padding: '0.8rem',

      '&[data-with-icon]': {
        paddingLeft: '0.8rem'
      }
    },

    icon: {
      marginRight: '0.8rem',
      backgroundColor: 'white',
      color: theme.colors[color][6],
      transform: 'scale(0)',
      animation: `${animation} 500ms 50ms ease forwards`,

      svg: {
        width: 30,
        height: 30,
        transform: `scale(${svgScale})`
      }
    },

    closeButton: {
      '&:hover': {
        backgroundColor: theme.white
      }
    }
  })
}
