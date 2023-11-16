import { useState } from 'react'
import { Popover, Button, Group, Tooltip } from '@mantine/core'

import { useRemoveCommunityMembership } from '~/api/communities/memberships/membership'
import { useUserPermissions } from '~/api/communities/user-scopes'
import { notifications } from '~/utils/notifications'

import ConfirmationModal from './components/ConfirmationModal'

const LeaveCommunity = ({ props }) => {
  const [opened, setOpened] = useState(false)
  const { refetch } = useUserPermissions()
  const setRemoveCommunityMembershipMutation = useRemoveCommunityMembership()

  const deleteMembership = () => {
    setRemoveCommunityMembershipMutation.mutate(props.community_id, {
      onSuccess: () => {
        notifications.showSuccess(`Community Membership Removed!`, { autoClose: true })

        refetch()
        setOpened(o => !o)
      },
      onError: () => {
        notifications.showError('Leave Community Failed!', { autoClose: true })
      }
    })
  }

  return (
    <Popover
      width={400}
      withinPortal={true}
      trapFocus
      position="left"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Tooltip label="Remove Community Membership">
          <Button
            variant="filled"
            size="xs"
            onClick={e => {
              e.stopPropagation()
              setOpened(o => !o)
            }}
          >
            LEAVE
          </Button>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <ConfirmationModal props={props} />

        <Group position="right" sx={{ paddingTop: '5%' }}>
          <Button
            variant="outline"
            size="xs"
            color="blue"
            onClick={e => {
              e.stopPropagation()
              setOpened(o => !o)
            }}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            color="blue"
            onClick={e => {
              e.stopPropagation()
              deleteMembership()
            }}
          >
            Confirm
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default LeaveCommunity
