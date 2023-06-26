import type { ReactElement } from 'react'
import { forwardRef } from 'react'
import { Flex, Group } from '@mantine/core'

import type { CommunityResponse } from '~/api/types/community-types'
import type { DataProps } from '~/types/data-props'

import * as S from './styles'

import {
  SuggestionsEmpty,
  SuggestionsError,
  SuggestionsLoading
} from '../../../../SearchPageNew/components/common'
import CreateCommunity from '../../../components/Manage/Community/CreateCommunity/CreateCommunity'
import type { CommunityScopes, ResourceScopes, SystemScopes } from '../../../contexts/scope-context'
import CommunityInfo from '../CommunityInfo/CommunityInfo'

const MARGIN_TOP = '4rem'

type Props = DataProps<CommunityResponse[]> & {
  queryTerms: string
  paginator?: ReactElement | false | null
  info?: ReactElement | false | null
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
      paginator,
      info,
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
        <SuggestionsEmpty
          size="md"
          mt={MARGIN_TOP}
          withIcon
          message="No communities found."
          secondary="Please refine your search and try again."
        />
      )
    }

    return (
      <Flex ref={ref} direction="column" css={S.root}>
        <div>
          {info}
          <Group position="right">
            <CreateCommunity system_scopes={system_scopes} />
          </Group>
        </div>

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

        {paginator}
      </Flex>
    )
  }
)

export default CommunityListContent
