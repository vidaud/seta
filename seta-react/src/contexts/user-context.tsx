import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { AxiosRequestConfig } from 'axios'
import { isAxiosError } from 'axios'

import type { User } from '~/types/user'

import api from '../api/api'
import { logout, useUserInfo } from '../api/auth'
import { environment } from '../environments/environment'
import type { NotificationsResponse } from '../pages/CommunitiesPage/pages/contexts/notifications-context'
import type { ChildrenProp } from '../types/children-props'

type UserContextProps = {
  user: User | null
  isLoading: boolean
  verify: () => void
  logout: () => Promise<unknown>
  notifications: NotificationsResponse[]
  total: number
  getNotificationRequests: () => void
}

const BASE_URL = environment.baseUrl
const NOTIFICATIONS_API_PATH = '/notifications/'

const apiConfig: AxiosRequestConfig = {
  baseURL: BASE_URL
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserProvider = ({ children }: ChildrenProp) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<NotificationsResponse[]>([])
  const [total, setTotal] = useState(0)

  const prevUserRef = useRef<User | null>(null)

  const { refetch: verifyUser } = useUserInfo({
    enabled: false
  })

  useEffect(() => {
    if (user) {
      return
    }

    const getUser = async () => {
      setLoading(true)

      try {
        const { data } = await verifyUser()

        if (!data) {
          setLoading(false)
          setUser(null)

          return
        }

        setUser(data)
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          setUser(null)
        }

        setLoading(false)
      }
    }

    getUser()
  }, [user, verifyUser])

  const getNotificationRequests = useCallback(async () => {
    let count = 0
    const result = await api.get<NotificationsResponse[]>(NOTIFICATIONS_API_PATH, apiConfig)

    result.data.forEach(element => {
      count += element.count
    })

    setTotal(count)
    setNotifications(result.data)

    return result.data
    // Allow the 100% step to be shown for 10 seconds
  }, [])

  useEffect(() => {
    let timeout: number | null = null

    if (user) {
      timeout = setTimeout(getNotificationRequests, 30000)

      return () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      }
    }
  }, [user, getNotificationRequests, notifications])

  // Delay the loading state to allow the user to be set first
  useEffect(() => {
    if (user?.username !== prevUserRef.current?.username) {
      prevUserRef.current = user
      setLoading(false)
      getNotificationRequests().then(response => {
        setNotifications(response)
      })
    }
  }, [user, getNotificationRequests])

  const value: UserContextProps = {
    user,
    isLoading: loading,
    verify: verifyUser,
    logout,
    notifications,
    total,
    getNotificationRequests
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useCurrentUser = () => {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a UserProvider')
  }

  return context
}
