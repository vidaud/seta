import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, ScrollArea } from '@mantine/core'

import ListMenuItem from './components/ListMenuItem'

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

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const handleItemClick = (value: string) => {
    setSelectedValue(value)
    onSelectHandler(value)
  }

  const handleItemMouseEnter = (value: string) => {
    setSelectedValue(value)
  }

  return (
    <Box className={className} tabIndex={-1}>
      <ScrollArea.Autosize mah={400} type="scroll" viewportRef={viewport}>
        {formattedItems.map(item => (
          <ListMenuItem
            key={item.value}
            {...item}
            selected={item.value === selectedValue}
            onClick={() => handleItemClick(item.value)}
            onMouseEnter={() => handleItemMouseEnter(item.value)}
          />
        ))}
      </ScrollArea.Autosize>
    </Box>
  )
}

export default ListMenu
