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
    color: '#868e96',
    borderRadius: '4px',
    ':hover': {
      cursor: 'auto'
    }
  }
}))

const ChangePrivacyRequestActions = ({ props }: Props) => {
  const { classes } = useStyles()
  const setChangeRequestMutation = useSetChangeMembershipRequest()

  const handleOpenedRequest = (community_id: string, message: string) => {
    setChangeRequestMutation.mutate({
      community_id: community_id,
      field_name: 'membership',
      new_value: ChangeMembershipRequestStatus.Opened,
      old_value: props.membership,
      message: message
    })

    if (setChangeRequestMutation.isError) {
      notifications.showError('The membership change request update failed!', { autoClose: true })
    } else {
      notifications.showSuccess(`New change request added!`, { autoClose: true })
    }
  }

  const handleClosedRequest = (community_id: string, message: string) => {
    setChangeRequestMutation.mutate({
      community_id: community_id,
      field_name: 'membership',
      new_value: ChangeMembershipRequestStatus.Restricted,
      old_value: props.membership,
      message: message
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
          onApprove={value => {
            handleOpenedRequest?.(props.community_id, value)
          }}
          onReject={value => {
            handleClosedRequest?.(props.community_id, value)
          }}
          community={props}
        />
      </Group>
    </>
  )
}

export default ChangePrivacyRequestActions
