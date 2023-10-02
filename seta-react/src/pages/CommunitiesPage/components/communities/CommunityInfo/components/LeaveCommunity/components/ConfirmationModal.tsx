import { useEffect, useState } from 'react'
import { Text, createStyles } from '@mantine/core'

import { useMembershipID } from '~/api/communities/memberships/membership'
import { useCurrentUser } from '~/contexts/user-context'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  text: { paddingBottom: theme.spacing.md }
}))

const ConfirmationModal = ({ props }) => {
  const { classes } = useStyles()
  const [memberNumber, setMemberNumber] = useState<number | undefined>()
  const { user } = useCurrentUser()
  const { data } = useMembershipID(props.community_id)

  useEffect(() => {
    setMemberNumber(
      data?.filter(
        item =>
          (item.role === 'CommunityOwner' || item.role === 'CommunityManager') &&
          user?.username === item.user_id
      )?.length
    )
  }, [props, user, data])

  return (
    <>
      {memberNumber === 1 ? (
        <>
          <Text weight={500} className={classes.form}>
            You are the only owner of this community!
          </Text>
          <Text weight={500} className={classes.form}>
            By leaving, all resources will be allocated as orphan and could not be reused by other
            users
          </Text>
        </>
      ) : (
        <Text weight={500} className={classes.form}>
          Are you sure you want to leave this community?
        </Text>
      )}
      <Text size="sm" className={classes.form}>
        Press Confirm to proceed or press Cancel to abort
      </Text>
    </>
  )
}

export default ConfirmationModal
