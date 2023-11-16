import { css } from '@emotion/react'
import { rem } from '@mantine/core'

export const header: ThemedCSS = theme => css`
  // padding: ${theme.spacing.md};
  // padding-top: 0;
  // padding-left: calc(${theme.spacing.md} + ${rem(10)});
  // margin-left: calc(${theme.spacing.md} * -1);
  // margin-right: calc(${theme.spacing.md} * -1);
  color: ${theme.colorScheme === 'dark' ? theme.white : theme.black};
  border-bottom: ${rem(1)} solid
    ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]};
`

export const linkPrimary = css`
  font-weight: 600;
`

export const linkChild: ThemedCSS = theme => css`
  padding-left: ${rem(31)};
  padding-right: ${rem(38)};
  font-weight: 500;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7]};
  border-left: ${rem(1)} solid
    ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]};

  &:hover {
    background-color: ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]};
    color: ${theme.colorScheme === 'dark' ? theme.white : theme.black};
  }
`
