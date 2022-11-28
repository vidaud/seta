import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Serializer } from '../serializers/serializer.interface';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  currentUser: User;
  constructor(private http: HttpClient, private authService: AuthenticationService) {
    this.authService.currentUserSubject.asObservable().subscribe((currentUser: User) => this.currentUser = currentUser)
  }

  public baseUrl = `${environment.baseUrl}${environment.baseApplicationContext}${environment.restEndPoint}`;

  // HTTP GET:

  private httpGetCall(url) {
    return this.http.get(url);
  }

  public getUserData(username) {
    let url = this.baseUrl + 'user/' + username;

    return this.httpGetCall(url);
  }

  public getState(username, stateKey) {
    let url = this.baseUrl + 'state/' + username + '/' + stateKey;

    return this.httpGetCall(url);
  }

  public getQueries(username) {
    let url = this.baseUrl + 'state/' + username  + '/' +'queries';

    return this.httpGetCall(url);
  }

  // HTTP POST:

  private httpPostCall(url, body) {
    return this.http.post<any>(url, body);
  }

  public updateUserData(username, f, v) {
    let url = this.baseUrl + 'user/set/' + username;
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
    let url = this.baseUrl + 'state/' + username;
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

      let url = environment.baseUrl + '/rest/v1/user/delete';
      let body = {
        username: un
      };

      this.http.post<any>(url, body).subscribe((r) => {
        this.authService.setaLogout();

      });
    }

  }

  public generateRsaKeys(): Observable<any> {
    let un = this.currentUser.username;

    let url = environment.baseUrl + '/rsa/v1/generate-rsa-keys';
    let body = {
      username: un
    };

    return this.http.post<any>(url, body)

  }

  public deleteRsaKeys() {
    let un = this.currentUser.username;

    let url = environment.baseUrl + '/rsa/v1/delete-rsa-keys';
    let body = {
      username: un
    };

    return this.http.post<any>(url, body);

  }

  public getPublicRsaKey(username: string): Observable<any> {

    let url = environment.baseUrl + `/rsa/v1/get-public-rsa-key/${username}`;

    return this.http.get<any>(url)

  }



  public convert<T>(items: any, serializer: Serializer): T[] {
    return items.map(item => serializer.fromJson(item));
  }

}
