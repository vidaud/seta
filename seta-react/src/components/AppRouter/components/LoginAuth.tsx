import { Navigate } from 'react-router-dom'

import PageLoader from '~/components/PageLoader'

import { useCurrentUser } from '~/contexts/user-context'

const HOME_PATH = '/'

const LoginAuth = ({ children }) => {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return <PageLoader />
  }

  if (!user) {
    return children
  }

  return <Navigate to={HOME_PATH} />
}

export default LoginAuth
