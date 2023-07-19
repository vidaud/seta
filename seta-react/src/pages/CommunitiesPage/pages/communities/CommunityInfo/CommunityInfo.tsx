import { createRef, useEffect } from 'react'
import { Flex, Group, Text, clsx, useMantineTheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FaChevronDown, FaUsers, FaUsersSlash } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'

import type {
  CommunityScopes,
  ResourceScopes,
  SystemScopes
} from '~/pages/CommunitiesPage/pages/contexts/scope-context'

import CommunityButton from './components/CommunityButton/CommunityButton'
import CommunityDetails from './components/CommunityDetails/CommunityDetails'
import * as S from './styles'

import { useMyCommunityResources } from '../../../../../api/communities/manage/my-community'
import type { CommunityResponse } from '../../../../../api/types/community-types'

type Props = {
  queryTerms: string
  community: CommunityResponse
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const CommunityInfo = ({ community, community_scopes }: Props) => {
  const { title, community_id, description, membership, created_at } = community
  const { data } = useMyCommunityResources(community_id)
  const theme = useMantineTheme()
  const location = useLocation()
  const ref = createRef<HTMLDivElement>()

  const [detailsOpen, { toggle }] = useDisclosure()

  const chevronClass = clsx({ open: detailsOpen })
  const openClass = clsx({ open: detailsOpen })

  const hasDetails = !!membership || !!community_id

  const toggleIcon = hasDetails && (
    <div css={S.chevron} className={chevronClass}>
      <FaChevronDown />
    </div>
  )

  useEffect(() => {
    if (location.hash === `#${community_id.replace(/ /g, '%20')}`) {
      toggle()
      ref.current?.scrollIntoView()
    }
    //prevent entering infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div css={S.root} className={openClass}>
      <div
        css={S.header}
        data-details={hasDetails}
        data-open={detailsOpen}
        onClick={toggle}
        ref={ref}
      >
        {membership === 'closed' ? (
          <FaUsersSlash size="1.5rem" color="orange" />
        ) : (
          <FaUsers size="1.5rem" color={theme.colors.teal[theme.fn.primaryShade()]} />
        )}

        <div css={S.title}>
          <Text fz="md" fw={600} truncate={detailsOpen ? undefined : 'end'}>
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </Text>
        </div>
        <CommunityButton props={community} community_scopes={community_scopes} resources={data} />
        {toggleIcon}
      </div>

      <Flex direction="column" gap="xs" data-info css={S.info}>
        <Group sx={{ gap: '0.4rem' }}>
          <Text size="sm">ID: {community_id.charAt(0).toUpperCase() + community_id.slice(1)}</Text>
          <Text size="sm">
            {'>'} Created at: {new Date(created_at).toDateString()}
          </Text>
        </Group>
        <Text size="xs">{description.charAt(0).toUpperCase() + description.slice(1)}</Text>
      </Flex>

      {hasDetails && (
        <CommunityDetails
          css={S.details}
          open={detailsOpen}
          community={community}
          community_scopes={community_scopes}
        />
      )}
    </div>
  )
}

export default CommunityInfo
