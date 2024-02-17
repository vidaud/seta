import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { fadeIn } from '~/styles/keyframe-animations'
import { transientProps } from '~/utils/styled-utils'

const BG_OPACITY = 0.15
const BG_OPACITY_HOVER = 0.3
const BORDER_RADIUS = '2px'

const slideMarkerLeft = keyframes({
  '0%': { transform: 'translateX(100%) scale(0) rotate(45deg)', opacity: 0 },
  '100%': { transform: 'translateX(0) scale(1) rotate(45deg)', opacity: 1 }
})

const slideMarkerRight = keyframes({
  '0%': { transform: 'translateX(-100%) scale(0) rotate(45deg)', opacity: 0 },
  '100%': { transform: 'translateX(0) scale(1) rotate(45deg)', opacity: 1 }
})

type Props = {
  $color: string
}

export const HighlightedText = styled(
  'span',
  transientProps
)<Props>(({ theme, $color }) => {
  const bgColorLight = theme.fn.rgba($color, BG_OPACITY)
  const bgColorDark = theme.fn.rgba($color, BG_OPACITY_HOVER)

  const colorDarker = theme.fn.darken($color, 0.1)

  return css`
    cursor: help;
    position: relative;
    border-bottom: 2px solid ${$color};
    background-color: ${bgColorLight};
    border-top-left-radius: ${BORDER_RADIUS};
    border-top-right-radius: ${BORDER_RADIUS};
    transition: all 0.2s ${theme.transitionTimingFunction};
    animation: ${fadeIn} 0.5s ease forwards;

    [data-tooltip] {
      position: absolute;
      display: flex;
      align-items: center;
      top: -2.2rem;
      left: -1px;
      width: max-content;
      height: 2rem;
      padding: 0.5rem;
      font-size: ${theme.fontSizes.sm};
      background-color: ${theme.colors.dark[5]};
      border-radius: ${theme.radius.sm};
      z-index: 100;
      transform: translateY(0.5rem);
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      transition: all 0.2s 0.15s ${theme.transitionTimingFunction};

      [data-category] {
        color: ${theme.colors.gray[1]};
      }

      [data-name] {
        color: ${theme.white};
        font-weight: 500;
      }
    }

    &:hover {
      background-color: ${bgColorDark};
      border-color: ${colorDarker};

      /* Start/end markers */
      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        background: ${colorDarker};
        margin-left: -3px;
        transition: all 0.2s ${theme.transitionTimingFunction};
      }

      &::before {
        top: 1rem;
        animation: ${slideMarkerLeft} 0.2s ease forwards;
      }

      &::after {
        bottom: 0;
        margin-bottom: -3px;
        animation: ${slideMarkerRight} 0.2s ease forwards;
      }

      [data-tooltip] {
        visibility: visible;
        transform: translateY(0rem);
        opacity: 1;
      }
    }
  `
})
