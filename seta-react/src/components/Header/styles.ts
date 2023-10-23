import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'

export const menu: ThemedCSS = theme => css`
  background-color: ${theme.other.jrcBlue};
  padding: 0.75rem 3%;
`

export const MenuLink = styled(NavLink)`
  padding: 0.5rem 1.25rem;
  color: white;
  border-radius: 4px;
  background-color: transparent;
  transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    ${({ theme }) => ({
      backgroundColor: theme.fn.rgba(theme.colors.gray[1], 0.2),
      color: theme.colors.gray[1]
    })};
  }

  &:active {
    transition: none;
    transform: translateY(1px);
  }

  &.active {
    ${({ theme }) => ({
      backgroundColor: theme.colors.gray[1],
      color: theme.other.jrcBlue,
      transform: 'scale(1.05)'
    })};
  }

  & + & {
    margin-left: 0.5rem;
  }
`

export const dropdownTarget: ThemedCSS = theme => css`
  opacity: 0.85;
  transition: background-color 0.2s ease;

  &[data-expanded='true'] {
    background-color: ${theme.fn.rgba(theme.colors.gray[3], 0.2)};
  }
`

export const dropdown: ThemedCSS = theme => css`
  & .seta-Menu-itemIcon {
    color: ${theme.colors.gray[7]};
  }
`

export const aboutDropdown: ThemedCSS = theme => css`
  z-index: 10 !important;
  & .seta-Menu-itemIcon {
    color: ${theme.colors.gray[7]};
  }
`

export const action: ThemedCSS = () => css`
  &:hover {
    background-color: unset;
    // background-color: rgba(248, 255, 250, 0.23;
  }
`

export const badge: ThemedCSS = () => css`
  margin-top: -1rem;
  margin-left: -2rem;
  &:hover {
    background-color: unset;
  }
`

export const button: ThemedCSS = theme => css`
  padding: 0.5rem 1.25rem;
  color: white;
  border-radius: 4px;
  background-color: transparent;
  transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    backgroundColor: ${theme.fn.rgba(theme.colors.gray[1], 0.2)},
    color: ${theme.colors.gray[1]}
  }
`
