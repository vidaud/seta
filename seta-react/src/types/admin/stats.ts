export enum StatsType {
  CommunityChangeRequest = 'community-change-request',
  ResourceChangeRequest = 'resource-change-request',
  OrphanedCommunities = 'orphaned-communities',
  OrphanedResources = 'orphaned-resources'
}

export type LightStatsResponse = {
  label: string
  count: number
  type: StatsType
}

export type SidebarStats = {
  totalChangeRequests: number
  communityChangeRequests: number
  resourceChangeRequests: number
  totalOrphans: number
  orphanedCommunities: number
  orphanedResources: number
}
