import { css } from '@emotion/react'

const INPUT_HEIGHT = '45px'

export const uploadButton: ThemedCSS = theme => css`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  min-height: ${INPUT_HEIGHT};
  min-width: ${INPUT_HEIGHT};
  height: ${INPUT_HEIGHT};
  width: ${INPUT_HEIGHT};
  border-color: ${theme.colors.gray[4]};
  z-index: 1;

  &[data-input-focused='true'] {
    border-top-color: ${theme.colors.blue[6]};
    border-left-color: ${theme.colors.blue[6]};
    border-bottom-color: ${theme.colors.blue[6]};
    border-right-color: transparent;

    // Prevent the right border from cutting off the input's border
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: -1px;
      bottom: 0;
      width: 1px;
      background-color: ${theme.colors.gray[4]};
    }
  }
`

export const input = css`
  margin-left: -1px;
  margin-right: -1px;

  .seta-Input-input {
    min-height: ${INPUT_HEIGHT};
    height: ${INPUT_HEIGHT};
    border-radius: 0;
    transition: none;
  }

  .renderer {
    line-height: calc(${INPUT_HEIGHT} - 2px);
  }
`

export const searchButtonWrapper = css`
  &[data-disabled='true'] {
    cursor: not-allowed;
  }
`

export const searchButton: ThemedCSS = theme => css`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  z-index: 1;
  height: ${INPUT_HEIGHT};

  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;

  &:disabled,
  &[data-loading='true'] {
    opacity: 0.7;
    background-color: ${theme.fn.primaryColor()};
    color: ${theme.colors.blue[1]};
  }

  &[data-loading='true'] {
    &::before {
      background-color: transparent;
    }

    & .seta-Button-leftIcon {
      margin-left: 2px;
      margin-right: 11px;
    }
  }
`
