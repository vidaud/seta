import { useState } from 'react'
import { Popover, Button, Group, Tooltip, Text } from '@mantine/core'

import { createOpenMembership } from '../../../../../../api/communities/membership'

const OpenCommunityMember = ({ community_id, reload }) => {
  const [opened, setOpened] = useState(false)

  const createMember = () => {
    createOpenMembership(community_id).then(() =>
      setTimeout(() => {
        reload()
        setOpened(o => !o)
      }, 100)
    )
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
