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
}

export const buildFilterInfo = ({
  chunkText,
  enableDateFilter,
  rangeValue,
  resourceSelectedKeys,
  taxonomySelectedKeys,
  otherItems
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

      fi.sourceValues.push({
        key: rKey,
        label: rKey,
        longLabel: rKey
      })
    }
  }

  if (taxonomySelectedKeys) {
    fi.taxonomyValues = []

    for (const tKey in taxonomySelectedKeys) {
      if (!taxonomySelectedKeys[tKey].checked) {
        continue
      }

      fi.taxonomyValues.push({
        key: tKey,
        label: tKey,
        longLabel: tKey
      })
    }
  }

  fi.otherItems = otherItems

  return fi
}
