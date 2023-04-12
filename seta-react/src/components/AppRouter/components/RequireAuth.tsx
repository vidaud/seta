import { Navigate } from 'react-router-dom'

import storageService from '../../../services/storage.service'
import type { ChildrenProp } from '../../../types/children-props'

// TODO: Get this from an environment variable
const AUTH_PATH = '/login'

const RequireAuth = ({ children }: ChildrenProp) => {
  // FIXME: StorageService isn't really a secure way to identify if a user is logged in
  const isAuthenticated = storageService.isLoggedIn()

  return isAuthenticated ? children : <Navigate to={AUTH_PATH} />
}

export default RequireAuth
