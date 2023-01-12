import axios from 'axios';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import { Serializer } from '../serializers/serializer.interface';
import authentificationService from './authentification.service';
import storageService from './storage.service';

class RestService {
  public currentUser: User | null = null;
  constructor() {
    const test = storageService.getUser();
    this.currentUser = test;
  }

  public baseUrl = `${environment.baseUrl}`;

  // HTTP GET:

  private httpGetCall(url) {
    return axios.get(url);
  }

  public getUserData(username) {
    let url = this.baseUrl + '/rest/v1/user-info';

    return this.httpGetCall(url);
  }

  public getState(username, stateKey) {
    let url = this.baseUrl + '/rest/v1/state/' + username + '/' + stateKey;

    return this.httpGetCall(url);
  }

  public getQueries(username) {
    let url = this.baseUrl + '/rest/v1/state/' + username  + '/queries';

    return this.httpGetCall(url);
  }

  // HTTP POST:

  private httpPostCall(url, body) {
    return axios.post<any>(url, body);
  }

  public updateUserData(username, f, v) {
    let url = this.baseUrl + '/user/set/' + username;
    let body = {
      field: f,
      value: v,
    };

    return this.httpPostCall(url, body);
  }

  public setState(username = '', k = '', v = '') {
    if (null == username || !username) {
      username = 'unknown';
    }
    let url = this.baseUrl + '/state/' + username;
    let body = {
      key: k,
      value: v,
    };

    return this.httpPostCall(url, body);
  }

  public deleteState(username = '', k = '') {
    if (null == username || !username) {
      username = 'unknown';
    }

    if (this.currentUser !== null) {

      let url = environment.baseUrl + '/rest/v1/state/delete';

      let body = {
        username: username,
        key: k
      };

      return this.httpPostCall(url, body);
    }
  }

  public deleteCurrentUserAccount() {
    if (this.currentUser != null) {

      let un = this.currentUser.username;
      const query: any = window.document.cookie.split('; ');
      let csrf_token = query.find(row => row.startsWith('csrf_access_token=')).split('=')[1];

      let url = environment.baseUrl + '/rest/v1/user/delete';
      let body = {
        username: un
      };

      axios.post<any>(url, body, {headers:{"X-CSRF-TOKEN": csrf_token}}).then((r) => {
        authentificationService.setaLogout();

      });
    }

  }

  public generateRsaKeys(): Observable<any> {
    let un = this.currentUser?.username;

    const query: any = window.document.cookie.split('; ');
    let csrf_token = query.find(row => row.startsWith('csrf_access_token=')).split('=')[1];
    
    let url = environment.baseUrl + '/rsa/v1/generate-rsa-keys';
    let body = {
      username: un
    };

    return axios.post<any>(url, body, {headers:{"X-CSRF-TOKEN": csrf_token}}) as any;

  }

  public deleteRsaKeys() {
    let un = this.currentUser?.username;

    const query: any = window.document.cookie.split('; ');
    let csrf_token = query.find(row => row.startsWith('csrf_access_token=')).split('=')[1];

    let url = environment.baseUrl + '/rsa/v1/delete-rsa-keys';
    let body = {
      username: un
    };

    return axios.post<any>(url, body, {headers:{"X-CSRF-TOKEN": csrf_token}});

  }

  public getPublicRsaKey(username: string) {
    let url = environment.baseUrl + '/rsa/v1/get-public-rsa-key/${username}';
    return axios.get<any>(url) as any;
  }

  public convert<T>(items: any, serializer: Serializer): T[] {
    return items.map(item => serializer.fromJson(item));
  }

}
export default new RestService();