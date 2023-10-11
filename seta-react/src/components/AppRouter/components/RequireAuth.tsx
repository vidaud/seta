import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

import PageLoader from '~/components/PageLoader'

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
    return <PageLoader />
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
