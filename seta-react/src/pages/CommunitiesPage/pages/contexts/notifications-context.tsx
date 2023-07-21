import { createContext, useContext, useEffect, useState } from 'react'
import type { AxiosRequestConfig } from 'axios'

import type { ChildrenProp } from '~/types/children-props'

import api from '../../../../api/api'
import { environment } from '../../../../environments/environment'
import useIsMounted from '../../../../hooks/use-is-mounted'

export type NotificationsResponse = {
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

const BASE_URL = environment.baseUrl

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined)

export const NotificationsProvider = ({ children }: ChildrenProp) => {
  const [notifications, setNotifications] = useState<NotificationsResponse[]>([])
  const [total, setTotal] = useState(0)
  const isMounted = useIsMounted()

  useEffect(() => {
    let timeout: number | null = null

    if (isMounted()) {
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
    const result = await api.get<NotificationsResponse[]>(`/notifications/`, apiConfig)

    result.data.forEach(element => {
      count += element.count
    })

    setTotal(count)

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