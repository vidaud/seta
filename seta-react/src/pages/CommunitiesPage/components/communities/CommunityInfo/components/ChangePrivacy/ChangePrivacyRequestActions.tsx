import { Group, createStyles } from '@mantine/core'

import { useSetChangeMembershipRequest } from '~/api/communities/memberships/membership-requests'
import type { CommunityResponse } from '~/api/types/community-types'
import { ChangeMembershipRequestStatus } from '~/types/community/change-membership-requests'
import { notifications } from '~/utils/notifications'

import RowActions from './components/RowActions'

type Props = {
  props: CommunityResponse
}

const useStyles = createStyles(() => ({
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    // width: '100%',
    borderRadius: '4px',
    ':hover': {
      // background: '#f1f3f5',
      cursor: 'auto'
    }
  }
}))

const ChangePrivacyRequestActions = ({ props }: Props) => {
  const { classes } = useStyles()
  const setChangeRequestMutation = useSetChangeMembershipRequest()

  const handleOpenedRequest = (community_id: string) => {
    setChangeRequestMutation.mutate({
      community_id: community_id,
      field_name: 'membership',
      new_value: ChangeMembershipRequestStatus.Opened,
      old_value: props.membership
    })

    if (setChangeRequestMutation.isError) {
      notifications.showError('The membership change request update failed!', { autoClose: true })
    } else {
      notifications.showSuccess(`New change request added!`, { autoClose: true })
    }
  }

  const handleClosedRequest = (community_id: string) => {
    setChangeRequestMutation.mutate({
      community_id: community_id,
      field_name: 'membership',
      new_value: ChangeMembershipRequestStatus.Restricted,
      old_value: props.membership
    })

    if (setChangeRequestMutation.isError) {
      notifications.showError('The membership change request update failed!', { autoClose: true })
    } else {
      notifications.showSuccess(`New change request added!`, { autoClose: true })
    }
  }

  return (
    <>
      <Group spacing={0} className={classes.button}>
        <RowActions
          onApprove={() => {
            handleOpenedRequest?.(props.community_id)
          }}
          onReject={() => {
            handleClosedRequest?.(props.community_id)
          }}
          community={props}
        />
      </Group>
    </>
  )
}

export default ChangePrivacyRequestActions
