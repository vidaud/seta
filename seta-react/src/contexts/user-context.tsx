import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'

import { useCommunitiesNotifications } from '~/api/communities/notifications'
import type { User } from '~/types/user'

import { logout, useUserInfo } from '../api/auth'
import type { ChildrenProp } from '../types/children-props'

type UserContextProps = {
  user: User | null
  isLoading: boolean
  verify: () => void
  logout: () => Promise<unknown>
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserProvider = ({ children }: ChildrenProp) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { refetch } = useCommunitiesNotifications()

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

  useEffect(() => {
    let timeout: number | null = null

    if (user) {
      timeout = setTimeout(refetch, 30000)

      return () => {
        if (timeout) {
          clearTimeout(timeout)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Delay the loading state to allow the user to be set first
  useEffect(() => {
    if (user?.username !== prevUserRef.current?.username) {
      prevUserRef.current = user
      setLoading(false)
    }
  }, [user])

  const value: UserContextProps = {
    user,
    isLoading: loading,
    verify: verifyUser,
    logout
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
