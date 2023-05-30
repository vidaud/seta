import type { ReactElement } from 'react'
import { Flex, clsx } from '@mantine/core'

import Breadcrumbs from '~/components/Breadcrumbs'
import Sidebar from '~/components/Sidebar'

import type { ChildrenProp, ClassNameProp } from '~/types/children-props'

import * as S from './styles'

type Props = {
  sidebarContent?: ReactElement
  breadcrumbs?: boolean
} & ChildrenProp &
  ClassNameProp

const Page = ({ className, sidebarContent, breadcrumbs, children }: Props) => {
  const rootCls = clsx({ 'with-breadcrumbs': breadcrumbs }, className)

  return (
    <Flex direction="column" css={S.root} className={rootCls}>
      {breadcrumbs && <Breadcrumbs />}

      <Flex css={S.pageWrapper}>
        {sidebarContent && <Sidebar withBreadcrumbs={breadcrumbs}>{sidebarContent}</Sidebar>}

        <Flex direction="column" align="center" css={S.contentWrapper}>
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Page
