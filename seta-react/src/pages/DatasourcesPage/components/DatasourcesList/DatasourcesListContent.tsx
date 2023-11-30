import { forwardRef } from 'react'
import { Flex, Text } from '@mantine/core'

import {
  SuggestionsEmpty,
  SuggestionsError,
  SuggestionsLoading
} from '~/pages/SearchPageNew/components/common'

import type { DatasourceResponse } from '~/api/types/datasource-types'
import type { DataProps } from '~/types/data-props'

import * as S from './styles'

import DatasourceInfo from '../DatasourceInfo/DatasourceInfo'

const MARGIN_TOP = '4rem'

type Props = DataProps<DatasourceResponse[]> & {
  queryTerms: string
}

const DatasourcesListContent = forwardRef<HTMLDivElement, Props>(
  ({ data, error, queryTerms, isLoading, onTryAgain }, ref) => {
    if (error) {
      return (
        <SuggestionsError
          size="md"
          mt={MARGIN_TOP}
          subject="Datasources"
          withIcon
          onTryAgain={onTryAgain}
        />
      )
    }

    if (isLoading || !data) {
      return <SuggestionsLoading size="lg" mt={MARGIN_TOP} color="blue" variant="bars" />
    }

    const datasources = data

    if (!datasources.length) {
      return (
        <>
          <SuggestionsEmpty size="md" mt={MARGIN_TOP} withIcon message="No datasources found." />
        </>
      )
    }

    return (
      <Flex ref={ref} direction="column" css={S.root}>
        <div>
          <Text fz="md" fw="bold" color="gray.7">
            DATASOURCES ({data?.length})
          </Text>
        </div>

        {datasources.map(datasource => (
          <DatasourceInfo
            key={datasource.resource_id}
            datasource={datasource}
            queryTerms={queryTerms}
          />
        ))}
      </Flex>
    )
  }
)

export default DatasourcesListContent
