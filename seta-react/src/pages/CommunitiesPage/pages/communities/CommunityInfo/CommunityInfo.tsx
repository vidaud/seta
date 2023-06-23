import { Flex, Text, clsx, Badge, Tooltip, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FaChevronDown, FaUser, FaUserSlash, FaUsers, FaUsersSlash } from 'react-icons/fa'
import { FcInvite, FcCancel } from 'react-icons/fc'
import { TbLoader } from 'react-icons/tb'

import CommunityDetails from './components/CommunityDetails/CommunityDetails'
import * as S from './styles'

import type { CommunityResponse } from '../../../../../api/types/community-types'
import CommunityButton from '../../../components/Discovery/CommunityList/components/CommunityButton/CommunityButton'

type Props = {
  queryTerms: string
  document: CommunityResponse
}

const CommunityInfo = ({ document, queryTerms }: Props) => {
  const { title, community_id, description, created_at, membership, status } = document

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
          <Tooltip label="Restricted Community" position="bottom" color="orange">
            <Badge variant="outline" color="orange">
              <FaUsersSlash />
            </Badge>
          </Tooltip>
        ) : (
          <Tooltip label="Opened Community" position="bottom" color="green">
            <Badge variant="outline" color="green">
              <FaUsers />
            </Badge>
          </Tooltip>
        )}
        <div css={S.title}>
          <Text fz="md" fw={600} truncate={detailsOpen ? undefined : 'end'}>
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </Text>
        </div>
        {toggleIcon}
      </div>

      <Flex direction="column" gap="xs" data-info css={S.info}>
        <Text size="xs">{description.charAt(0).toUpperCase() + description.slice(1)}</Text>
        <Text size="xs">{community_id.charAt(0).toUpperCase() + community_id.slice(1)}</Text>
        <Text size="sm">{new Date(created_at).toDateString()}</Text>
        <Group>
          <Group position="left" style={{ width: '65%' }}>
            {status === 'membership' ? (
              <Tooltip label="Member" position="bottom" color="green">
                <Badge variant="outline" color="green" w="min-content">
                  <FaUser />
                </Badge>
              </Tooltip>
            ) : status === 'invited' ? (
              <Tooltip label="Invited" position="bottom" color="gray">
                <Badge variant="outline" color="gray" w="min-content">
                  <FcInvite />
                </Badge>
              </Tooltip>
            ) : status === 'rejected' ? (
              <Tooltip label="Rejected" position="bottom" color="red">
                <Badge variant="outline" color="red" w="min-content">
                  <FcCancel />
                </Badge>
              </Tooltip>
            ) : status === 'pending' ? (
              <Tooltip label="Rejected" position="bottom" color="gray">
                <Badge variant="outline" color="gray" w="min-content">
                  <TbLoader />
                </Badge>
              </Tooltip>
            ) : status === 'unknown' ? (
              <Tooltip label="Not Member" position="bottom" color="orange">
                <Badge variant="outline" color="orange" w="min-content">
                  <FaUserSlash />
                </Badge>
              </Tooltip>
            ) : null}
          </Group>
          <Group position="right" style={{ width: '33%' }}>
            <CommunityButton props={document} />
          </Group>
        </Group>
      </Flex>

      {hasDetails && <CommunityDetails css={S.details} open={detailsOpen} id={community_id} />}
    </div>
  )
}

export default CommunityInfo
