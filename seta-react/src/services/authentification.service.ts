import axios from 'axios'
import type { Observable } from 'rxjs'
import { BehaviorSubject } from 'rxjs'
import { getCookie } from 'typescript-cookie'

import logger from '~/utils/logger'

import storageService from './storage.service'

import { environment } from '../environments/environment'
import type { User } from '../models/user.model'

const AUTH_API = environment.authenticationUrl

class AuthentificationService {
  public currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)

  constructor() {
    if (storageService.isLoggedIn()) {
      this.currentUserSubject.next(storageService.getUser())

      // We return early if the user is already logged in.
      return
    }

    const url = new URL(window.location.href)
    const action = url.searchParams.get('action')

    if (action === 'login') {
      url.searchParams.delete('action')

      // We must replace the current URL with the one without the `action` parameter.
      // Using `replaceState` instead of `pushState` because we don't want to add a new entry to the browser's history.
      // eslint-disable-next-line no-restricted-globals
      history.replaceState(null, '', url)

      this.loadProfile()
    }
  }

  loadProfile() {
    this.profile()
  }

  setaLogout() {
    ;(
      axios.post(
        AUTH_API + '/logout',
        {},
        { headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } }
      ) as any
    ).then(() => {
      window.location.href = AUTH_API + '/logout/ecas'
      this.currentUserSubject.next(null)
      storageService.clean()
    })
  }

  setaLocalLogout() {
    axios
      .post(
        AUTH_API + '/logout',
        {},
        { headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' } }
      )
      .then(() => {
        this.currentUserSubject.next(null)
        storageService.clean()
        window.location.href = '/login'
      }) as any
  }

  profile(): Observable<User | null> {
    axios
      .get<User>(AUTH_API + '/user-info')
      .then(response => {
        const user = response.data

        storageService.saveUser(user)
        this.currentUserSubject.next(user)
      })
      .catch(error => {
        logger.error(error)
      })

    return this.currentUserSubject
  }

  async refreshToken(): Promise<any> {
    const csrf_token = getCookie('csrf_refresh_token')

    return axios
      .post(
        AUTH_API + '/refresh',
        {},
        {
          headers: { 'X-CSRF-TOKEN': csrf_token }
        }
      )
      .then((response: any) => {
        return response
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 401) {
            //redirect to logout
            this.setaLocalLogout()
          }
        }
      }) as any
  }
}
export default new AuthentificationService()
