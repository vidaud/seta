import { forwardRef } from 'react'
import { Flex, Text } from '@mantine/core'

import type { ResourceResponse } from '~/api/types/resource-types'
import type { DataProps } from '~/types/data-props'

import * as S from './styles'

import {
  SuggestionsEmpty,
  SuggestionsError,
  SuggestionsLoading
} from '../../../../SearchPageNew/components/common'
import type { CommunityScopes, ResourceScopes, SystemScopes } from '../../contexts/scope-context'
import ResourceInfo from '../ResourceInfo/ResourceInfo'

const MARGIN_TOP = '4rem'

type Props = DataProps<ResourceResponse[]> & {
  queryTerms: string
  community_scopes?: CommunityScopes[]
  resource_scopes?: ResourceScopes[]
  system_scopes?: SystemScopes[]
}

const ResourceListContent = forwardRef<HTMLDivElement, Props>(
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
        </>
      )
    }

    return (
      <Flex ref={ref} direction="column" css={S.root} sx={{ width: '100%' }}>
        <div>
          <Text fz="md" color="gray.7">
            Showing {data?.length} results
          </Text>
        </div>

        {communities.map(resource => (
          <ResourceInfo
            key={resource.resource_id}
            resource={resource}
            queryTerms={queryTerms}
            community_scopes={community_scopes}
            resource_scopes={resource_scopes}
            system_scopes={system_scopes}
          />
        ))}
      </Flex>
    )
  }
)

export default ResourceListContent
