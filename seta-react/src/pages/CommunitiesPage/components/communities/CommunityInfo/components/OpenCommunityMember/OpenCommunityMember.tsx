import { Button, Group, Tooltip } from '@mantine/core'

import { useOpenCommunityMembership } from '~/api/communities/memberships/membership'
import { notifications } from '~/utils/notifications'

const OpenCommunityMember = ({ community_id }) => {
  const setOpenCommunityMembershipMutation = useOpenCommunityMembership(community_id)

  const createMember = () => {
    setOpenCommunityMembershipMutation.mutate(null, {
      onSuccess: () => {
        notifications.showSuccess(`You are now member of the community!`, { autoClose: true })
      },
      onError: () => {
        notifications.showError('Membership Request Failed!', { autoClose: true })
      }
    })
  }

  return (
    <Group position="right">
      <Tooltip label="Join Community">
        <Button
          variant="filled"
          color="orange"
          size="xs"
          onClick={e => {
            e.stopPropagation()
            createMember()
          }}
        >
          + JOIN
        </Button>
      </Tooltip>
    </Group>
  )
}

export default OpenCommunityMember
