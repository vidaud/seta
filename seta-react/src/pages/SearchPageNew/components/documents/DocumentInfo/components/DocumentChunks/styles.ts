import { css } from '@emotion/react'

export const root: ThemedCSS = theme => css`
  padding: 0 ${theme.spacing.md};

  .highlight {
    &::before {
      animation-delay: 300ms;
    }
  }
`

const getBorderSvg = (bgColor: string) =>
  'data:image/svg+xml;utf-8,<?xml version="1.0" encoding="utf-8"?>' +
  '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
  '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' +
  'x="0" y="0" width="9px" height="6px" viewBox="0 0 9 6"  xml:space="preserve">' +
  '<polygon opacity="0.2" points="4.5,4.5 0,0 0,1.2 4.5,5.7 9,1.2 9,0" />' +
  '<polygon points="0,0.2 4.5,5 9,0.2" fill="' +
  // Convert # to %23 to avoid issues with URL encoding
  bgColor.replace('#', '%23') +
  '" />' +
  '</svg>'

const BORDER_MARGIN = '-0.8rem'

export const chunkRoot: ThemedCSS = theme => css`
  position: relative;
  margin: 0 calc(-${theme.spacing.md} - ${theme.spacing.xl});
  padding: 0 calc(${theme.spacing.md} + ${theme.spacing.xl});
  background-color: ${theme.colors.gray[0]};

  &:nth-of-type(even) {
    background-color: ${theme.colors.gray[1]};

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: ${BORDER_MARGIN};
      left: 0;
      width: 100%;
      height: ${theme.spacing.xl};
      background: 0 center repeat-x url('${getBorderSvg(theme.colors.gray[1])}');
    }

    &::before {
      transform: rotate(180deg);
    }

    &::after {
      top: auto;
      bottom: ${BORDER_MARGIN};
      z-index: 1;
    }

    &:last-of-type {
      margin-bottom: ${theme.spacing.md};
    }
  }
`

export const chunk: ThemedCSS = theme => css`
  white-space: pre-wrap;
  text-align: justify;
  color: ${theme.colors.gray[8]};
  padding: ${theme.spacing.lg} 0;
`

export const chunkNumber: ThemedCSS = theme => css`
  position: absolute;
  top: 0.375rem;
  right: ${theme.spacing.lg};
  color: ${theme.colors.gray[5]};
  font-size: ${theme.fontSizes.xs};
`

export const currentChunkMarker: ThemedCSS = theme => css`
  position: absolute;
  top: ${theme.spacing.xl};
  bottom: ${theme.spacing.xl};
  left: ${theme.spacing.md};
  width: 6px;
  background-color: ${theme.fn.rgba(theme.colors.teal[4], 0.5)};
  border-radius: ${theme.radius.md};
`
