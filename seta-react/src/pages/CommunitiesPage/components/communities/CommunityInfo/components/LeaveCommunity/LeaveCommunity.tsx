import { useEffect, useState } from 'react'
import { Text, Popover, Button, Group, createStyles, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { getMembership, leaveCommunity } from '~/api/communities/membership'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  text: { paddingBottom: theme.spacing.md }
}))

const LeaveCommunity = ({ props, refetch }) => {
  const { classes } = useStyles()
  const [opened, setOpened] = useState(false)
  const [memberNumber, setMemberNumber] = useState<number | undefined>()

  useEffect(() => {
    getMembership(props.community_id).then(response => {
      setMemberNumber(
        response?.members.filter(
          item => item.role === 'CommunityOwner' || item.role === 'CommunityManager'
        )?.length
      )
    })
  }, [props])

  const deleteMembership = () => {
    leaveCommunity(props.community_id)
      .then(() => {
        refetch()
        notifications.show({
          title: 'Community Membership Removed',
          message:
            'You are no longer member of this community. \nClick Join to send a new membership request.',
          styles: theme => ({
            root: {
              backgroundColor: theme.colors.blue[6],
              borderColor: theme.colors.blue[6],
              '&::before': { backgroundColor: theme.white }
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.blue[7] }
            }
          })
        })
      })
      .catch(error => {
        notifications.show({
          title: error.response.statusText,
          message: error.response.data.message,
          styles: theme => ({
            root: {
              backgroundColor: theme.colors.red[6],
              borderColor: theme.colors.red[6],
              '&::before': { backgroundColor: theme.white }
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.red[7] }
            }
          })
        })
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
        <Tooltip label="Remove Community Membership" color="blue">
          <Button
            variant="filled"
            size="xs"
            onClick={e => {
              e.stopPropagation()
              memberNumber === 1 ? setOpened(o => !o) : deleteMembership()
            }}
            // onClick={() => deleteMembership()}
          >
            LEAVE
          </Button>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Text weight={500} className={classes.form}>
          You are the only owner of this community!
        </Text>
        <Text weight={500} className={classes.form}>
          By leaving, all resources will be allocated as orphan and could not be reused by other
          users
        </Text>
        <Text size="sm" className={classes.form}>
          Press Confirm to proceed with the deletion or press Cancel to abort
        </Text>
        <Group position="right">
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
