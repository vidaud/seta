import { createContext, useContext, useEffect, useState } from 'react'

import type { ChildrenProp } from '~/types/children-props'

import community_api from '../../../../api/communities/api'
import useIsMounted from '../../../../hooks/use-is-mounted'

type NotificationsResponse = {
  label: string
  description: string
  count: number
  type: string
  priority: number
}

type NotificationsContextProps = {
  notifications: NotificationsResponse[]
  total: number
  getNotificationRequests: () => void
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined)

export const NotificationsProvider = ({ children }: ChildrenProp) => {
  const [notifications, setNotifications] = useState<NotificationsResponse[]>([])
  const [total, setItotal] = useState(0)
  const isMounted = useIsMounted()

  useEffect(() => {
    let timeout: number | null = null

    if (isMounted()) {
      // After a short delay, we ignore subsequent calls to onSearch
      // to prevent it from triggering when allowSearching changes based on user interaction
      timeout = setTimeout(() => {
        if (notifications) {
          getNotificationRequests().then(response => {
            setNotifications(response.data)
          })
        }
      }, 3000)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [isMounted, notifications])

  const getNotificationRequests = async () => {
    let count = 0
    const result = await community_api.get<NotificationsResponse[]>(`/notifications/`)

    result.data.forEach(element => {
      count += element.count
    })

    setItotal(count)

    return result
    // Allow the 100% step to be shown for a second
  }

  const value: NotificationsContextProps = {
    notifications,
    total,
    getNotificationRequests
  }

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext)

  if (context === undefined) {
    throw new Error('useNotifications must be used within an NotificationsProvider')
  }

  return context
}
