import { forwardRef } from 'react'
import { Divider, Flex, Group, Text } from '@mantine/core'

import type { CommunityResponse } from '~/api/types/community-types'
import type { DataProps } from '~/types/data-props'

import * as S from './styles'

import {
  SuggestionsEmpty,
  SuggestionsError,
  SuggestionsLoading
} from '../../../../SearchPageNew/components/common'
import type { CommunityScopes, ResourceScopes, SystemScopes } from '../../contexts/scope-context'
import CommunityInfo from '../CommunityInfo/CommunityInfo'
import CreateCommunity from '../CommunityInfo/components/CreateCommunity/CreateCommunity'

const MARGIN_TOP = '4rem'

type Props = DataProps<CommunityResponse[]> & {
  queryTerms: string
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const CommunityListContent = forwardRef<HTMLDivElement, Props>(
  (
    {
      data,
      error,
      queryTerms,
      isLoading,
      onTryAgain,
      community_scopes,
      resource_scopes,
      system_scopes
    },
    ref
  ) => {
    if (error) {
      return (
        <SuggestionsError
          size="md"
          mt={MARGIN_TOP}
          subject="communities"
          withIcon
          onTryAgain={onTryAgain}
        />
      )
    }

    if (isLoading || !data) {
      return <SuggestionsLoading size="lg" mt={MARGIN_TOP} color="blue" variant="bars" />
    }

    const communities = data

    if (!communities.length) {
      return (
        <>
          <SuggestionsEmpty
            size="md"
            mt={MARGIN_TOP}
            withIcon
            message="No communities found."
            secondary="Please create your own community"
          />
          <Group position="center">
            <CreateCommunity system_scopes={system_scopes} />
          </Group>
        </>
      )
    }

    return (
      <Flex ref={ref} direction="column" css={S.root} sx={{ width: '100%' }}>
        <Text fz="md" color="gray.7">
          Showing {data?.length} results
        </Text>

        {communities.map(community => (
          <CommunityInfo
            key={community.community_id}
            community={community}
            queryTerms={queryTerms}
            community_scopes={community_scopes}
            resource_scopes={resource_scopes}
            system_scopes={system_scopes}
          />
        ))}
        <Divider size="xs" />
        <Group position="right">
          <CreateCommunity system_scopes={system_scopes} />
        </Group>
      </Flex>
    )
  }
)

export default CommunityListContent
