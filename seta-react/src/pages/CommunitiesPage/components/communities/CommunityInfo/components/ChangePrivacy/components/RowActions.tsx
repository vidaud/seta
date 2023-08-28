import { useState } from 'react'
import { Group, Switch, useMantineTheme } from '@mantine/core'
import { FaUsers, FaUsersSlash } from 'react-icons/fa'

import { useCommunityChangeRequests } from '~/api/communities/community-change-requests'
import type { CommunityResponse } from '~/api/types/community-types'

type Props = {
  onApprove(): void
  onReject(): void
  community: CommunityResponse
}

const RowActions = ({ onApprove, onReject, community }: Props) => {
  const activeLink = community.membership
  const [checked, setChecked] = useState(community.membership === 'opened')
  const theme = useMantineTheme()
  const { data } = useCommunityChangeRequests(community.community_id)

  return (
    <>
      <Group noWrap>
        {data?.community_change_requests.filter(
          item => item.status === 'pending' && item.field_name === 'membership'
        ).length === 0 ? (
          <Switch
            checked={checked}
            onChange={event => {
              setChecked(event.currentTarget.checked)

              if (activeLink !== 'opened') {
                onApprove()
              } else {
                onReject()
              }
            }}
            color="teal"
            size="md"
            label={activeLink === 'closed' ? 'Restricted Community' : 'Opened Community'}
            thumbIcon={
              checked ? (
                <FaUsers
                  size="0.8rem"
                  color={theme.colors.teal[theme.fn.primaryShade()]}
                  stroke="3"
                />
              ) : (
                <FaUsersSlash
                  size="0.8rem"
                  color={theme.colors.orange[theme.fn.primaryShade()]}
                  stroke="3"
                />
              )
            }
          />
        ) : (
          <Switch
            checked={community.membership !== 'opened'}
            disabled={true}
            color="teal"
            size="md"
            label="Request Pending"
            thumbIcon={
              checked ? (
                <FaUsers
                  size="0.8rem"
                  color={theme.colors.gray[theme.fn.primaryShade()]}
                  stroke="3"
                />
              ) : (
                <FaUsersSlash
                  size="0.8rem"
                  color={theme.colors.gray[theme.fn.primaryShade()]}
                  stroke="3"
                />
              )
            }
          />
        )}
      </Group>
    </>
  )
}

export default RowActions
