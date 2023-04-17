import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, ScrollArea } from '@mantine/core'

import ListMenuItem from './components/ListMenuItem'
import * as S from './styles'

const isListOfStrings = (items: string[] | { label: string; value: string }[]): items is string[] =>
  !!items.length && typeof items[0] === 'string'

type LabelValue = {
  label: string
  value: string
}

type Props = {
  className?: string
  items: string[] | LabelValue[]
  onSelect?: (value: string) => void
}

const ListMenu = ({ className, items, onSelect }: Props) => {
  const viewport = useRef<HTMLDivElement>(null)

  const formattedItems: LabelValue[] = useMemo(
    () =>
      isListOfStrings(items)
        ? [...new Set(items.map(item => ({ label: item, value: item })))]
        : items, // TODO: remove duplicates when items are not strings
    [items]
  )

  const [selectedValue, setSelectedValue] = useState<string | undefined>(formattedItems[0].value)

  const itemHeight = (viewport.current?.scrollHeight ?? 0) / formattedItems.length

  const moveSelection = useCallback(
    (direction: 'up' | 'down') => {
      const index = formattedItems.findIndex(item => item.value === selectedValue)
      const nextIndex = direction === 'up' ? index - 1 : index + 1

      if (nextIndex >= 0 && nextIndex < formattedItems.length) {
        setSelectedValue(formattedItems[nextIndex].value)

        const scrollTo = itemHeight * (nextIndex - 2) // Keep 3 items in view (including selected one)

        viewport.current?.scrollTo({ top: scrollTo, behavior: 'smooth' })
      }
    },
    [formattedItems, selectedValue, itemHeight]
  )

  const onSelectHandler = useCallback(
    (value: string) => {
      // setSelectedValue(value)
      onSelect?.(value)
    },
    [onSelect]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown': {
          moveSelection('down')
          break
        }

        case 'ArrowUp': {
          moveSelection('up')
          break
        }

        case 'Enter': {
          if (selectedValue) {
            onSelectHandler(selectedValue)
          }
        }
      }
    },
    [moveSelection, onSelectHandler, selectedValue]
  )

  const handleItemClick = (value: string) => {
    console.log('handleItemClick', value)

    setSelectedValue(value)
    onSelectHandler(value)
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <Box className={className} css={S.root} tabIndex={-1}>
      <ScrollArea.Autosize mah={300} type="scroll" viewportRef={viewport}>
        {formattedItems.map(item => (
          <ListMenuItem
            key={item.value}
            {...item}
            selected={item.value === selectedValue}
            onClick={() => handleItemClick(item.value)}
          />
        ))}
      </ScrollArea.Autosize>
    </Box>
  )
}

export default ListMenu
