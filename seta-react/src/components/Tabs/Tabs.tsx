import type { ForwardedRef, ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { TabsListProps } from '@mantine/core'
import { Tabs as MantineTabs } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'

import type { ClassAndChildrenProps } from '~/types/children-props'

import { CurrentTabProvider } from './contexts/tabs-context'
import * as S from './styles'

const SCROLL_DELAY = 0

export type TabsProps = {
  panels: ReactElement
  defaultValue?: string
  position?: TabsListProps['position']
  tabsRef?: ForwardedRef<HTMLDivElement>
  noScroll?: boolean
  onTabChange?: (value: string) => void
} & ClassAndChildrenProps

const Tabs = ({
  panels,
  defaultValue,
  className,
  tabsRef,
  noScroll,
  onTabChange,
  children,
  ...rest
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue ?? null)

  const prevTabRef = useRef<string | undefined>(defaultValue)
  const timeoutRef = useRef<number | undefined>(undefined)

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    duration: 100,
    offset: 16
  })

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleTabChange = (value: string) => {
    if (!noScroll) {
      timeoutRef.current = window.setTimeout(() => {
        scrollIntoView()
      }, SCROLL_DELAY)
    }

    if (prevTabRef.current === value) {
      return
    }

    setActiveTab(value)

    prevTabRef.current = value

    onTabChange?.(value)
  }

  return (
    <MantineTabs
      css={S.root}
      ref={targetRef}
      className={className}
      variant="outline"
      value={activeTab}
      onTabChange={handleTabChange}
      {...rest}
    >
      <CurrentTabProvider value={activeTab}>
        <MantineTabs.List ref={tabsRef} position="center">
          {children}
        </MantineTabs.List>

        {panels}
      </CurrentTabProvider>
    </MantineTabs>
  )
}

export default Tabs
