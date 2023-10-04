import { Flex, Loader } from '@mantine/core'
import { Navigate } from 'react-router-dom'

import { useCurrentUser } from '~/contexts/user-context'

const HOME_PATH = '/'

const LoginAuth = ({ children }) => {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <Flex align="center" justify="center" m="auto" h="100vh">
        <Loader size="xl" />
      </Flex>
    )
  }

  if (!user) {
    return children
  }

  return <Navigate to={HOME_PATH} />
}

export default LoginAuth
