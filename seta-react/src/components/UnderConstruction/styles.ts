import { css } from '@emotion/react'
import { rem } from '@mantine/core'

export const root = css`
  padding-top: ${rem(80)};
  padding-bottom: ${rem(80)};
`

export const label: ThemedCSS = theme => css`
  text-align: center;
  font-weight: 900;
  font-size: ${rem(120)};
  line-height: 1;
  margin-bottom: calc(${theme.spacing.xl} * 1.5);
  color: ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]};

  [${theme.fn.smallerThan('sm')}] {
    font-size: ${rem(120)};
  }
`

export const title: ThemedCSS = theme => css`
  font-family: Greycliff CF, ${theme.fontFamily};
  text-align: 'center';
  font-weight: 900;
  font-size: ${rem(38)};

  [${theme.fn.smallerThan('sm')}] {
    font-size: ${rem(32)};
  }
`

export const description: ThemedCSS = theme => css`
  max-width: ${rem(500)};
  margin: 'auto';
  margin-top: ${theme.spacing.xl};
  margin-bottom: calc(${theme.spacing.xl} * 1.5);
`
