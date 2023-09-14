import { useEffect } from 'react'
import { Badge, Group } from '@mantine/core'

import { useCommunitiesNotifications } from '~/api/communities/notifications'

import NotificationsMenu from './NotificationsMenu'

import type { DropdownItem } from '../config'
import * as S from '../styles'

type Props = {
  dropdownItems: DropdownItem[]
}

const NotificationsButton = ({ dropdownItems }: Props) => {
  // FIXME: This needs to be fixed - Array.map should always return a value
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
