import { useState } from 'react'
import { Popover, Button, Group, Tooltip, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'

import { createOpenMembership } from '~/api/communities/membership'

const OpenCommunityMember = ({ community_id, refetch }) => {
  const [opened, setOpened] = useState(false)

  const createMember = () => {
    createOpenMembership(community_id)
      .then(() => {
        setTimeout(() => {
          refetch()
          setOpened(o => !o)
        }, 100)

        notifications.show({
          title: 'Open Community Joined',
          message: 'You are now a member of this community',
          styles: theme => ({
            root: {
              backgroundColor: theme.colors.teal[6],
              borderColor: theme.colors.teal[6],
              '&::before': { backgroundColor: theme.white }
            },
            title: { color: theme.white },
            description: { color: theme.white },
            closeButton: {
              color: theme.white,
              '&:hover': { backgroundColor: theme.colors.teal[7] }
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
      width={300}
      withinPortal={true}
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <Group position="right">
          <Tooltip label="Join Community" color="orange">
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
      </Popover.Target>
      <Popover.Dropdown
        sx={theme => ({
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
        })}
      >
        <Text>New Member Added</Text>
      </Popover.Dropdown>
    </Popover>
  )
}

export default OpenCommunityMember
