import { useEffect, useState } from 'react'
import { createStyles, Switch, useMantineTheme } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { FaUsers, FaUsersSlash } from 'react-icons/fa'

import type { CommunityScopes } from '~/pages/CommunitiesPage/contexts/community-list.context'

import {
  createCommunityChangeRequest,
  useCommunityChangeRequests
} from '~/api/communities/community-change-requests'
import { useAllCommunities } from '~/api/communities/discover/discover-communities'
import type { ChangeRequestResponse } from '~/api/types/change-request-types'
import type { CommunityResponse } from '~/api/types/community-types'

const useStyles = createStyles(theme => ({
  form: {
    marginTop: '20px'
  },
  divider: {
    paddingBottom: theme.spacing.md
  },
  text: {
    textAlign: 'center'
  },
  dropdown: {
    background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  },
  button: {
    padding: '0.625rem 0.75rem',
    color: '#868e96',
    width: '100%',
    borderRadius: '4px',
    ':hover': { background: '#f1f3f5' }
  }
}))

type Props = {
  community: CommunityResponse
  community_scopes?: CommunityScopes[] | undefined
}

const ChangePrivacy = ({ community }: Props) => {
  const { refetch } = useAllCommunities()
  const { data } = useCommunityChangeRequests(community.community_id)
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [checked, setChecked] = useState(community.membership === 'opened')
  const [changeRequests, setChangeRequests] = useState<ChangeRequestResponse | undefined>(data)

  useEffect(() => {
    if (data) {
      setChangeRequests(data)
    }
  }, [data])

  const handleSwitch = (value: boolean, id: string) => {
    const formValues = {
      field_name: 'membership',
      new_value: value ? 'opened' : 'closed',
      old_value: community.membership
    }

    createCommunityChangeRequest(id, formValues)
      .then(() => {
        refetch()
        notifications.show({
          title: 'Request Created Successfully',
          message: 'Community privacy change request has been successfully created',
          styles: () => ({
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
          styles: () => ({
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
    <>
      {changeRequests?.community_change_requests.filter(
        item => item.status === 'pending' && item.field_name === 'membership'
      ).length === 0 ? (
        <Switch
          className={classes.button}
          checked={checked}
          onChange={event => {
            setChecked(event.currentTarget.checked)
            event.stopPropagation()
            handleSwitch(event.currentTarget.checked, community.community_id)
          }}
          color="teal"
          size="md"
          label={checked ? 'Switch to Restricted Request' : 'Switch to Opened Request'}
          thumbIcon={
            checked ? (
              <FaUsers size="0.8rem" color={theme.colors.teal[theme.fn.primaryShade()]} />
            ) : (
              <FaUsersSlash size="0.8rem" color={theme.colors.orange[theme.fn.primaryShade()]} />
            )
          }
        />
      ) : (
        <Switch
          className={classes.button}
          checked={!checked}
          color="teal"
          size="md"
          disabled={true}
          label={checked ? 'Switch to Restricted Pending' : 'Switch to Opened Pending'}
          thumbIcon={
            !checked ? (
              <FaUsers size="0.8rem" color={theme.colors.teal[theme.fn.primaryShade()]} />
            ) : (
              <FaUsersSlash size="0.8rem" color={theme.colors.orange[theme.fn.primaryShade()]} />
            )
          }
        />
      )}
    </>
  )
}

export default ChangePrivacy
