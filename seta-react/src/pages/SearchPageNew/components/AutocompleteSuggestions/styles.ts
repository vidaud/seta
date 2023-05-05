import { css } from '@emotion/react'
import styled from '@emotion/styled'

export const infoText: ThemedCSS = theme => css`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.gray[6]};
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`
