import type { ReactElement } from 'react'
import { Flex, Loader } from '@mantine/core'
import { Navigate } from 'react-router-dom'

import { useCurrentUser } from '~/contexts/user-context'
import type { UserRole } from '~/types/user'

// TODO: Get this from an environment variable
const AUTH_PATH = '/login?redirect=' + window.location.pathname
const HOME_PATH = '/'

type Props = {
  allowedRoles?: UserRole[]
  children: ReactElement
}

const RequireAuth = ({ children, allowedRoles }: Props) => {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <Flex align="center" justify="center" m="auto" h="100vh">
        <Loader size="xl" />
      </Flex>
    )
  }

  if (!user) {
    return <Navigate to={AUTH_PATH} />
  }

  //render page if allowedRole is undefined or roles match
  if (!allowedRoles || allowedRoles.includes(user.role.toLowerCase() as UserRole)) {
    return children
  }

  return <Navigate to={HOME_PATH} />
}

export default RequireAuth
