import { useEffect } from 'react'
import { Badge, Group } from '@mantine/core'

import type { DropdownItem } from '~/components/Header/config'
import * as S from '~/components/Header/styles'

import { useCommunitiesNotifications } from '~/api/communities/notifications'

import NotificationsMenu from './NotificationsMenu'

type Props = {
  dropdownItems: DropdownItem[]
}

const NotificationsButton = ({ dropdownItems }: Props) => {
  const { data, refetch } = useCommunitiesNotifications()

  useEffect(() => {
    let timeout: number | null = null

    timeout = setTimeout(refetch, 30000)

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Group>
      <NotificationsMenu
        dropdownItems={dropdownItems}
        notifications={data?.notifications}
        total={data?.totalNotifications}
      />
      {data?.totalNotifications && data?.totalNotifications > 0 ? (
        <Badge variant="filled" size="xs" css={S.badge}>
          {data?.totalNotifications}
        </Badge>
      ) : null}
    </Group>
  )
}

export default NotificationsButton
