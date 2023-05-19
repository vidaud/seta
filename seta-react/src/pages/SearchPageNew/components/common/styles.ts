import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`

export const icon = css`
  line-height: 0;
`

export const errorIcon: ThemedCSS = theme => css`
  color: ${theme.colors.red[5]};
`
