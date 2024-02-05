import { useMemo } from 'react'

import type { GroupedLabels, Label } from '~/types/filters/label'

const useGroupedLabels = (labels: Label[] | undefined) => {
  // Group labels by category
  const groupedLabels = useMemo(
    () =>
      labels?.reduce((acc, label) => {
        const { id, name, color, category } = label

        if (!acc[category]) {
          acc[category] = []
        }

        acc[category].push({ id, name, color, category })

        return acc
      }, {} as GroupedLabels) ?? {},
    [labels]
  )

  return { groupedLabels }
}

export default useGroupedLabels
