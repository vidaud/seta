export enum StatsType {
  Unknown = 'unknown'
}

export type LightStatsResponse = {
  label: string
  count: number
  type: StatsType
}
