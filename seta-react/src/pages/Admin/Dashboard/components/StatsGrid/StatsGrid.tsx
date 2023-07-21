import { Grid, ThemeIcon } from '@mantine/core'
import { IconGitPullRequest, IconAlertOctagon } from '@tabler/icons-react'

import { SuggestionsError, SuggestionsLoading } from '~/pages/SearchPageNew/components/common'

import type { DataProps } from '~/types/data-props'
import { StatsType, type LightStatsResponse } from '~/types/stats/stats'

import SimpleStat from '../SimpleStat'

const icons = new Map([
  [StatsType.CommunityChangeRequest, IconGitPullRequest],
  [StatsType.ResourceChangeRequest, IconGitPullRequest],
  [StatsType.OrphanedCommunities, IconAlertOctagon],
  [StatsType.OrphanedResources, IconAlertOctagon]
])

const labels = new Map([
  [StatsType.CommunityChangeRequest, 'requests'],
  [StatsType.ResourceChangeRequest, 'requests'],
  [StatsType.OrphanedCommunities, 'orphans'],
  [StatsType.OrphanedResources, 'orphans']
])

const StatsGrid = ({ data, isLoading, error, onTryAgain }: DataProps<LightStatsResponse[]>) => {
  if (error) {
    return <SuggestionsError onTryAgain={onTryAgain} />
  }

  if (isLoading || !data) {
    return <SuggestionsLoading />
  }

  const stats = data.map(stat => {
    const Icon = icons.get(stat.type) ?? IconGitPullRequest
    let label = labels.get(stat.type) ?? ''

    //remove 's' from the end of the word
    if (stat.count === 1) {
      label = label.substring(0, label.length - 1)
    }

    return (
      <Grid.Col key={stat.label} lg={3} md={6} xs={12}>
        <SimpleStat
          title={stat.label}
          count={stat.count}
          label={label}
          icon={
            <ThemeIcon variant="light" size={35}>
              <Icon size="1.5rem" stroke={1.5} />
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
