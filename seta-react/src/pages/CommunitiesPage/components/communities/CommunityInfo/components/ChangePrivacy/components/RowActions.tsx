import { Tooltip, ActionIcon, Group, createStyles } from '@mantine/core'
import { FaUsers, FaUsersSlash } from 'react-icons/fa'

import type { CommunityResponse } from '~/api/types/community-types'

type Props = {
  onApprove(): void
  onReject(): void
  community: CommunityResponse
}

const useStyles = createStyles(() => ({
  button: {
    padding: 2
  }
}))

const RowActions = ({ onApprove, onReject, community }: Props) => {
  const { classes } = useStyles()
  const activeLink = community.membership

  return (
    <>
      <Group noWrap sx={{ gap: 0 }}>
        <Tooltip
          label={activeLink === 'opened' ? 'Opened Community' : 'Restricted Community'}
          color="teal"
        >
          <ActionIcon
            w={70}
            sx={{ borderRadius: '0.25rem 0 0 0.25rem' }}
            style={activeLink === 'opened' ? {} : { borderRight: 'none' }}
            variant={activeLink === 'opened' ? 'filled' : 'outline'}
            color="teal"
            onClick={() => {
              if (activeLink !== 'opened') {
                onApprove()
              }
            }}
          >
            <FaUsers stroke="1.5" size="md" className={classes.button} />
          </ActionIcon>
        </Tooltip>
        <Tooltip
          label={
            activeLink === 'closed' ? 'Restricted Community' : 'Opened Community'
            // : 'Switch to Restricted Community Request'
          }
          color="yellow"
        >
          <ActionIcon
            w={70}
            sx={{ borderRadius: '0 0.25rem 0.25rem 0' }}
            style={activeLink === 'closed' ? {} : { borderLeft: 'none' }}
            variant={activeLink === 'closed' ? 'filled' : 'outline'}
            color="yellow"
            onClick={() => {
              if (activeLink !== 'closed') {
                onReject()
              }
            }}
          >
            <FaUsersSlash stroke="1.5" size="md" className={classes.button} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </>
  )
}

export default RowActions
