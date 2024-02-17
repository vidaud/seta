import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader, ScrollArea } from '@mantine/core'

import LabelsGroup from '~/components/LabelsGroup'
import { SuggestionsError } from '~/pages/SearchPageNew/components/common'
import useGroupedLabels from '~/pages/SearchWithFilters/components/LabelsFilter/hooks/useGroupedLabels'

import useScrolled from '~/hooks/use-scrolled'
import type { DataProps } from '~/types/data-props'
import type { Label } from '~/types/search/annotations'
import { findLabels } from '~/utils/labels-utils'

import * as S from './styles'

import NoAnnotations from '../NoAnnotations'

type Props = DataProps<Label[]> & {
  searchValue: string
  selectedLabels: Label[]
  isModalOpen?: boolean
  onSelectedChange: (labels: Label[]) => void
  onRefetch: () => void
}

const LabelsModalContent = ({
  data,
  searchValue,
  isLoading,
  error,
  selectedLabels,
  isModalOpen,
  onSelectedChange,
  onRefetch
}: Props) => {
  const [isInitialSearching, setIsInitialSearching] = useState(true)

  const foundLabels = useMemo(() => findLabels(data, searchValue), [data, searchValue])

  const { groupedLabels } = useGroupedLabels(foundLabels)

  const { scrolled, handleScrollChange } = useScrolled()

  // Hold the value of the found labels when the modal is opened
  const initialFoundLabelsRef = useRef(foundLabels)

  useEffect(() => {
    // If the modal is open, set the initial searching state to true to show the loader
    if (isModalOpen) {
      setIsInitialSearching(true)
    }
  }, [isModalOpen])

  useEffect(() => {
    // If the found labels change and there's a search value, set the initial searching state to false to hide the loader
    if (searchValue && initialFoundLabelsRef.current !== foundLabels) {
      setIsInitialSearching(false)
    }
  }, [foundLabels, searchValue])

  const handleLabelClick = (label: Label) => {
    // Toggle the label
    const newSelected = selectedLabels.some(l => l.id === label.id)
      ? selectedLabels.filter(l => l.id !== label.id)
      : [...selectedLabels, label]

    onSelectedChange(newSelected)
  }

  const handleGroupClick = (category: string) => {
    const clickedLabels = groupedLabels[category]

    // If at least one label in the group is selected, deselect all labels in the group
    const newSelected = selectedLabels.some(l => l.id === clickedLabels[0].id)
      ? selectedLabels.filter(l => !clickedLabels.some(cl => cl.id === l.id))
      : [...selectedLabels, ...clickedLabels]

    onSelectedChange(newSelected)
  }

  if (isLoading || !data || isInitialSearching) {
    // Negative margin to compensate the grid gap in the parent component
    return <Loader mx="auto" mt="-1rem" />
  }

  if (error) {
    return (
      <SuggestionsError
        size="md"
        subject="annotations"
        withIcon
        mt="-1rem"
        onTryAgain={onRefetch}
      />
    )
  }

  if (!data.length) {
    return <NoAnnotations message="There are no annotations available in the system." />
  }

  if (!foundLabels?.length) {
    return <NoAnnotations message="No annotations found for this search." />
  }

  return (
    <div css={S.container} data-scrolled={scrolled}>
      <ScrollArea.Autosize mx="auto" h="100%" onScrollPositionChange={handleScrollChange}>
        {Object.entries(groupedLabels).map(([category, groupLabels]) => (
          <LabelsGroup
            key={category}
            css={S.group}
            category={category}
            labels={groupLabels}
            searchValue={searchValue}
            selected={selectedLabels}
            onLabelClick={handleLabelClick}
            onGroupClick={() => handleGroupClick(category)}
          />
        ))}
      </ScrollArea.Autosize>
    </div>
  )
}

export default LabelsModalContent
