import axios from 'axios'
import type { Observable } from 'rxjs'
import { getCookie } from 'typescript-cookie'

import authentificationService from './authentification.service'
import storageService from './storage.service'

import { environment } from '../environments/environment'
import type { User } from '../models/user.model'
import type { Serializer } from '../serializers/serializer.interface'

class RestService {
  public currentUser: User | null = null
  constructor() {
    const test = storageService.getUser()

    this.currentUser = test
  }

  public baseUrl = `${environment.baseUrl}`

  // HTTP GET:

  private httpGetCall(url) {
    return axios.get(url)
  }

  public getUserData(username) {
    const url = this.baseUrl + '/me/user-info'

    return this.httpGetCall(url)
  }
  // HTTP POST:

  private httpPostCall(url, body) {
    return axios.post<any>(url, body)
  }

  public deleteCurrentUserAccount() {
    if (this.currentUser != null) {
      const un = this.currentUser.username
      const csrf_token = getCookie('csrf_access_token')

      const url = environment.baseUrl + '/me/user/delete'
      const body = {
        username: un
      }

      axios
        .post<any>(url, body, { withCredentials: true, headers: { 'X-CSRF-TOKEN': csrf_token } })
        .then(r => {
          authentificationService.setaLogout()
        })
    }
  }

  public generateRsaKeys(): Observable<any> {
    const un = this.currentUser?.username

    const csrf_token = getCookie('csrf_access_token')

    const url = environment.baseUrl + '/me/generate-rsa-keys'
    const body = {
      username: un
    }

    return axios.post<any>(url, body, {
      withCredentials: true,
      headers: { 'X-CSRF-TOKEN': csrf_token }
    }) as any
  }

  public deleteRsaKeys() {
    const un = this.currentUser?.username

    const csrf_token = getCookie('csrf_access_token')

    const url = environment.baseUrl + '/me/delete-rsa-keys'
    const body = {
      username: un
    }

    return axios.post<any>(url, body, {
      withCredentials: true,
      headers: { 'X-CSRF-TOKEN': csrf_token }
    })
  }

  public getPublicRsaKey() {
    const url = environment.baseUrl + '/me/get-public-rsa-key'

    return axios.get<any>(url) as any
  }

  public convert<T>(items: any, serializer: Serializer): T[] {
    return items.map(item => serializer.fromJson(item))
  }

  // TODO: Figure out the status of the comments below

  /*Andrei - this is not working for more than 2 cokies
  public getCookie(name: string): string {
    const query: any = window.document.cookie.split('; ');
    if (query.length > 2) {
      let csrf_token = query.find(row => row.startsWith(`${name}=`)).split('=');
      if (csrf_token.length === 2) {
        return csrf_token[1];
      }
    }
    return '';
  }*/

  /*
  public getCookie(name: string): string|null {
    const nameLenPlus = (name.length + 1);
    return document.cookie
      .split(';')
      .map(c => c.trim())
      .filter(cookie => {
        return cookie.substring(0, nameLenPlus) === `${name}=`;
      })
      .map(cookie => {
        return decodeURIComponent(cookie.substring(nameLenPlus));
      })[0] || null;
  }*/
}
export default new RestService()
