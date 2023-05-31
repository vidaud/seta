import type { FilterData } from '../../types/filter-data'
import { ViewFilterInfo } from '../../types/filter-info'
import type { RangeValue, SelectionKeys } from '../../types/filters'
import { TextChunkValues } from '../../types/filters'
import type { OtherItem } from '../../types/other-filter'

type Props = {
  chunkText: TextChunkValues
  enableDateFilter: boolean
  rangeValue?: RangeValue
  resourceSelectedKeys?: SelectionKeys | null
  taxonomySelectedKeys?: SelectionKeys | null
  otherItems?: OtherItem[]
  resources?: FilterData[]
  taxonomies?: FilterData[]
}

export const buildFilterInfo = ({
  chunkText,
  enableDateFilter,
  rangeValue,
  resourceSelectedKeys,
  taxonomySelectedKeys,
  otherItems,
  resources,
  taxonomies
}: Props): ViewFilterInfo => {
  const fi = new ViewFilterInfo()

  fi.chunkValue = TextChunkValues[chunkText]
  fi.rangeValueEnabled = enableDateFilter && !!rangeValue
  fi.rangeValue = enableDateFilter && !!rangeValue ? { ...rangeValue } : undefined

  if (resourceSelectedKeys) {
    fi.sourceValues = []

    for (const rKey in resourceSelectedKeys) {
      if (!resourceSelectedKeys[rKey].checked) {
        continue
      }

      const kl = resources?.find(r => r.key === rKey)
      const lbl = kl ? kl.label : rKey

      fi.sourceValues.push({
        key: rKey,
        label: lbl,
        longLabel: lbl
      })
    }
  }

  if (taxonomySelectedKeys) {
    fi.taxonomyValues = []

    for (const tKey in taxonomySelectedKeys) {
      if (!taxonomySelectedKeys[tKey].checked) {
        continue
      }

      const kl = taxonomies?.find(r => r.key === tKey)
      const lbl = kl ? kl.label : tKey

      fi.taxonomyValues.push({
        key: tKey,
        label: lbl,
        longLabel: lbl
      })
    }
  }

  fi.otherItems = otherItems

  return fi
}
