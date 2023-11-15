import type { ReactElement } from 'react'
import { Flex, clsx } from '@mantine/core'

import Breadcrumbs from '~/components/Breadcrumbs'

import type { Crumb } from '~/types/breadcrumbs'
import type { ChildrenProp, ClassNameProp } from '~/types/children-props'

import * as S from './styles'

import UserSidebar from '../UserSidebar'

type Props = {
  sidebarContent?: ReactElement
  breadcrumbs?: Crumb[]
} & ChildrenProp &
  ClassNameProp

const UserPage = ({ className, sidebarContent, breadcrumbs, children }: Props) => {
  const rootCls = clsx({ 'with-breadcrumbs': breadcrumbs }, className)

  return (
    <Flex direction="column" css={S.root} className={rootCls}>
      {/* {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} />} */}
      <Breadcrumbs readFromPath />

      <Flex css={S.pageWrapper}>
        {sidebarContent && (
          <UserSidebar withBreadcrumbs={!!breadcrumbs}>{sidebarContent}</UserSidebar>
        )}

        <Flex direction="column" pl="xs" pr="xs" css={S.contentWrapper}>
          {children}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default UserPage
