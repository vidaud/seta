import { useEffect, useState } from 'react'
import { Text, Popover, Button, Group, createStyles } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

import { getMembership } from '../../../../../../../api/communities/membership'
import { leaveCommunity } from '../../../../../../../api/communities/my-membership'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  text: { paddingBottom: theme.spacing.md }
}))

const LeaveCommunity = ({ props, onChangeMessage, onReload }) => {
  const { classes } = useStyles()
  const [opened, setOpened] = useState(false)
  const navigate = useNavigate()
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
        setTimeout(() => {
          onReload()
        }, 100)

        navigate(`/communities`)
      })
      .catch(error => {
        if (error.response.status === 409) {
          onChangeMessage(error.response.data.message)
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
        <Button
          variant="filled"
          size="xs"
          onClick={() => {
            memberNumber === 1 ? setOpened(o => !o) : deleteMembership()
          }}
          // onClick={() => deleteMembership()}
        >
          LEAVE
        </Button>
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
          <Button variant="outline" size="xs" color="blue" onClick={() => setOpened(o => !o)}>
            Cancel
          </Button>
          <Button size="xs" color="blue" onClick={() => deleteMembership()}>
            Confirm
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}

export default LeaveCommunity
