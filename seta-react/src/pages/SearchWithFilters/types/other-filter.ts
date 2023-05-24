export enum OtherItemStatus {
  APPLIED = 'APPLIED',
  NEW = 'NEW',
  DELETED = 'DELETED'
}

export type OtherItem = {
  id: string
  name: string
  value: string
  status: OtherItemStatus
}
