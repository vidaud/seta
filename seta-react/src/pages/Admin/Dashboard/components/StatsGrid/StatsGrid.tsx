import { Grid, ThemeIcon } from '@mantine/core'
import { IconGitPullRequest } from '@tabler/icons-react'

import { SuggestionsError, SuggestionsLoading } from '~/pages/SearchPageNew/components/common'

import { type LightStatsResponse } from '~/types/admin/stats'
import type { DataProps } from '~/types/data-props'

import SimpleStat from '../SimpleStat'

const StatsGrid = ({ data, isLoading, error, onTryAgain }: DataProps<LightStatsResponse[]>) => {
  if (error) {
    return <SuggestionsError subject="stats" onTryAgain={onTryAgain} />
  }

  if (isLoading || !data) {
    return <SuggestionsLoading />
  }

  const stats = data.map(stat => {
    return (
      <Grid.Col key={stat.label} lg={3} md={6} xs={12}>
        <SimpleStat
          title={stat.label}
          count={stat.count}
          label=""
          icon={
            <ThemeIcon variant="light" size={35}>
              <IconGitPullRequest size="1.5rem" stroke={1.5} />
            </ThemeIcon>
          }
        />
      </Grid.Col>
    )
  })

  return (
    <Grid w="100%" p="md" gutterLg={70}>
      {stats}
    </Grid>
  )
}

export default StatsGrid
