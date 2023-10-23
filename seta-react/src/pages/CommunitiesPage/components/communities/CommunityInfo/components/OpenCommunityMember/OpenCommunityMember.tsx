import { Button, Group, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { useOpenCommunityMembership } from '~/api/communities/memberships/membership'

const OpenCommunityMember = ({ community_id }) => {
  const setOpenCommunityMembershipMutation = useOpenCommunityMembership(community_id)

  const createMember = () => {
    setOpenCommunityMembershipMutation.mutate(null, {
      onSuccess: () => {
        notifications.show({
          message: `You are now member of the community!`,
          color: 'blue',
          autoClose: 5000
        })
      },
      onError: () => {
        notifications.show({
          message: 'Membership Request Failed!',
          color: 'red',
          autoClose: 5000
        })
      }
    })
  }

  return (
    <Group position="right">
      <Tooltip label="Join Community">
        <Button
          id="join_community"
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
