import { Flex, Text, clsx, Badge, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FaChevronDown, FaUser, FaUserSlash, FaUsers, FaUsersSlash } from 'react-icons/fa'
import { FcInvite, FcCancel } from 'react-icons/fc'
import { TbLoader } from 'react-icons/tb'

import type {
  CommunityScopes,
  ResourceScopes,
  SystemScopes
} from '~/pages/CommunitiesPage/pages/contexts/scope-context'

import CommunityButton from './components/CommunityButton/CommunityButton'
import CommunityDetails from './components/CommunityDetails/CommunityDetails'
import UpdateCommunity from './components/UpdateCommunity/UpdateCommunity'
import * as S from './styles'

import type { CommunityResponse } from '../../../../../api/types/community-types'

type Props = {
  queryTerms: string
  community: CommunityResponse
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const membershipColors: Record<string, string> = {
  closed: 'orange',
  opened: 'green'
}

const CommunityInfo = ({ community, community_scopes }: Props) => {
  const { title, community_id, description, membership, status } = community

  const [detailsOpen, { toggle }] = useDisclosure()

  const chevronClass = clsx({ open: detailsOpen })
  const openClass = clsx({ open: detailsOpen })

  const hasDetails = !!membership || !!status

  const toggleIcon = hasDetails && (
    <div css={S.chevron} className={chevronClass}>
      <FaChevronDown />
    </div>
  )

  return (
    <div css={S.root} className={openClass}>
      <div css={S.header} data-details={hasDetails} data-open={detailsOpen} onClick={toggle}>
        {membership === 'closed' ? (
          <Tooltip label="Restricted Community" color={membershipColors[membership.toLowerCase()]}>
            <Badge variant="outline" color={membershipColors[membership.toLowerCase()]}>
              <FaUsersSlash />
            </Badge>
          </Tooltip>
        ) : (
          <Tooltip label="Opened Community" color={membershipColors[membership.toLowerCase()]}>
            <Badge variant="outline" color={membershipColors[membership.toLowerCase()]}>
              <FaUsers />
            </Badge>
          </Tooltip>
        )}
        {status === 'membership' ? (
          <Tooltip label="Member" color="green">
            <Badge variant="outline" color="green" w="min-content">
              <FaUser />
            </Badge>
          </Tooltip>
        ) : status === 'invited' ? (
          <Tooltip label="Invited" color="gray">
            <Badge variant="outline" color="gray" w="min-content">
              <FcInvite />
            </Badge>
          </Tooltip>
        ) : status === 'rejected' ? (
          <Tooltip label="Rejected" color="red">
            <Badge variant="outline" color="red" w="min-content">
              <FcCancel />
            </Badge>
          </Tooltip>
        ) : status === 'pending' ? (
          <Tooltip label="Rejected" color="gray">
            <Badge variant="outline" color="gray" w="min-content">
              <TbLoader />
            </Badge>
          </Tooltip>
        ) : status === 'unknown' ? (
          <Tooltip label="Not Member" color="orange">
            <Badge variant="outline" color="orange" w="min-content">
              <FaUserSlash />
            </Badge>
          </Tooltip>
        ) : null}
        <div css={(S.title, S.titleGroup)}>
          <Text fz="md" fw={600} truncate={detailsOpen ? undefined : 'end'}>
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </Text>
          <UpdateCommunity id={community_id} community_scopes={community_scopes} />
        </div>
        <CommunityButton props={community} community_scopes={community_scopes} />
        {toggleIcon}
      </div>

      <Flex direction="column" gap="xs" data-info css={S.info}>
        <Text size="xs">{description.charAt(0).toUpperCase() + description.slice(1)}</Text>
      </Flex>

      {hasDetails && (
        <CommunityDetails
          css={S.details}
          open={detailsOpen}
          id={community_id}
          community={community}
          community_scopes={community_scopes}
        />
      )}
    </div>
  )
}

export default CommunityInfo
