import { Flex, Loader } from '@mantine/core'
import { Navigate } from 'react-router-dom'

import { useCurrentUser } from '~/contexts/user-context'

import type { ChildrenProp } from '../../../types/children-props'

// TODO: Get this from an environment variable
const AUTH_PATH = '/login'

const RequireAuth = ({ children }: ChildrenProp) => {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <Flex align="center" justify="center" m="auto" h="100vh">
        <Loader size="xl" />
      </Flex>
    )
  }

  return user ? children : <Navigate to={AUTH_PATH} />
}

export default RequireAuth
