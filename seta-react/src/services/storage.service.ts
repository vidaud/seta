import type { User } from '../models/user.model'

const USER_KEY = 'auth-user'

class StorageService {
  clean(): void {
    window.sessionStorage.clear()
  }

  public saveUser(user: User): void {
    window.sessionStorage.removeItem(USER_KEY)
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  public getUser(): User {
    const user = window.sessionStorage.getItem(USER_KEY)

    if (user) {
      return JSON.parse(user)
    }

    return {}
  }

  // FIXME: I think this might be unsecure.
  // I can get access to the pages only an authenticated user should see
  // by simply adding any value with the key of 'auth-user' to the session storage.
  public isLoggedIn(): boolean {
    const user = sessionStorage.getItem(USER_KEY)

    if (user) {
      return true
    }

    return false
  }
}
export default new StorageService()
