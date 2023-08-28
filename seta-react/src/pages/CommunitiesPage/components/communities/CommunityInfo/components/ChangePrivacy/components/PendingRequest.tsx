import { Tooltip, ActionIcon, Group, createStyles, Text } from '@mantine/core'
import { FaUsers, FaUsersSlash } from 'react-icons/fa'

import type { CommunityResponse } from '~/api/types/community-types'

type Props = {
  community: CommunityResponse
}

const useStyles = createStyles(() => ({
  button: {
    padding: 2
  }
}))

const PendingRequest = ({ community }: Props) => {
  const { classes } = useStyles()
  const activeLink = community.membership

  return (
    <>
      <Group noWrap sx={{ gap: 0 }}>
        <Tooltip
          label={
            activeLink === 'opened'
              ? 'Request Switch to Restricted Community Pending'
              : 'Request Switch to Opened Community Pending'
          }
        >
          <span>
            <ActionIcon
              w={50}
              disabled={true}
              variant="outline"
              // onClick={onApprove}
            >
              {activeLink === 'closed' ? (
                <FaUsers stroke="1.5" size="md" className={classes.button} />
              ) : (
                <FaUsersSlash stroke="1.5" size="md" className={classes.button} />
              )}
            </ActionIcon>
          </span>
        </Tooltip>
        <Text sx={{ paddingLeft: '0.75rem' }} color="#868e96" size="sm">
          {activeLink === 'opened' ? 'Restricted Community Pending' : 'Opened Community Pending'}
        </Text>
      </Group>
    </>
  )
}

export default PendingRequest
