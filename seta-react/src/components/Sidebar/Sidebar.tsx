import { Flex, Navbar, ScrollArea, Box, clsx } from '@mantine/core'

import type { ChildrenProp, ClassNameProp } from '~/types/children-props'

import * as S from './styles'

type Props = {
  withBreadcrumbs?: boolean
} & ChildrenProp &
  ClassNameProp

const Sidebar = ({ className, withBreadcrumbs, children }: Props) => {
  const navbarCls = clsx({ 'with-breadcrumbs': withBreadcrumbs })

  return (
    <Flex className={className} css={S.wrapper}>
      <Navbar css={S.sidebar} className={navbarCls}>
        <Navbar.Section className="section" grow component={ScrollArea}>
          <Box pt="2rem">{children}</Box>
        </Navbar.Section>
      </Navbar>
    </Flex>
  )
}

export default Sidebar
