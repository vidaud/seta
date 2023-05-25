import keysDiff from '../../custom/array-diffs'
import type { FilterStatusInfo, NodeInfo } from '../../types/filter-info'
import { OtherItemStatus } from '../../types/other-filter'

export const getSourceLists = (status?: FilterStatusInfo) => {
  let sourceApplied: NodeInfo[] | undefined = undefined
  let sourceDeleted: NodeInfo[] | undefined = undefined
  let sourceAdded: NodeInfo[] | undefined = undefined

  const aKeys = status?.appliedFilter?.sourceValues?.map(s => s.key)
  const cKeys = status?.currentFilter?.sourceValues?.map(s => s.key)

  const { removed, added } = keysDiff(aKeys, cKeys)

  sourceApplied = status?.appliedFilter?.sourceValues?.filter(
    n => removed?.findIndex(r => r === n.key) === -1
  )

  sourceDeleted = status?.appliedFilter?.sourceValues?.filter(
    n => removed?.findIndex(r => r === n.key) !== -1
  )

  sourceAdded = status?.currentFilter?.sourceValues?.filter(
    n => added?.findIndex(r => r === n.key) !== -1
  )

  return { sourceApplied, sourceDeleted, sourceAdded }
}

export const getTaxonomyLists = (status?: FilterStatusInfo) => {
  let taxonomyApplied: NodeInfo[] | undefined = undefined
  let taxonomyDeleted: NodeInfo[] | undefined = undefined
  let taxonomyAdded: NodeInfo[] | undefined = undefined

  const aKeys = status?.appliedFilter?.taxonomyValues?.map(s => s.key)
  const cKeys = status?.currentFilter?.taxonomyValues?.map(s => s.key)

  const { removed, added } = keysDiff(aKeys, cKeys)

  taxonomyApplied = status?.appliedFilter?.taxonomyValues?.filter(
    n => removed?.findIndex(r => r === n.key) === -1
  )

  taxonomyDeleted = status?.appliedFilter?.taxonomyValues?.filter(
    n => removed?.findIndex(r => r === n.key) !== -1
  )

  taxonomyAdded = status?.currentFilter?.taxonomyValues?.filter(
    n => added?.findIndex(r => r === n.key) !== -1
  )

  return { taxonomyApplied, taxonomyDeleted, taxonomyAdded }
}

export const getOtherLists = (status?: FilterStatusInfo) => {
  const items = status?.appliedFilter?.otherItems

  const otherApplied: NodeInfo[] | undefined = items
    ?.filter(i => i.status === OtherItemStatus.APPLIED)
    ?.map(a => {
      return { key: a.id, label: a.name + ' : ' + a.value, longLabel: '' }
    })
  const otherDeleted: NodeInfo[] | undefined = items
    ?.filter(i => i.status === OtherItemStatus.DELETED)
    ?.map(a => {
      return { key: a.id, label: a.name + ' : ' + a.value, longLabel: '' }
    })
  const otherAdded: NodeInfo[] | undefined = items
    ?.filter(i => i.status === OtherItemStatus.NEW)
    ?.map(a => {
      return { key: a.id, label: a.name + ' : ' + a.value, longLabel: '' }
    })

  return { otherApplied, otherDeleted, otherAdded }
}
