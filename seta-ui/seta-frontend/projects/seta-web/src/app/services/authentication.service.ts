import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { UserSerializer } from '../serializers/user.serializer';
import { TokenStorageService } from '../token-storage.service';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  getRefreshedAccessToken(token: string) {
    return this.http.post(environment.baseUrl + environment.baseApplicationContext + 'refresh',
      {}, { headers: { Authorization: `Bearer ${token}` } });
  }

  public currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null)
  private jwtHelper: JwtHelperService;
  public baseUrl;
  isTokenDecoded: boolean;
  decodedToken: any;
  accessToken: any;
  refreshToken: any;

  constructor(public http: HttpClient, private tokenService: TokenStorageService, private activeRouter: ActivatedRoute) {
    this.jwtHelper = new JwtHelperService();

    let jwt = this.tokenService.getToken()

    this.currentUserSubject = new BehaviorSubject<User>(this.jwtHelper.decodeToken(jwt));

    this.baseUrl = `${environment.baseUrl}${environment.baseApplicationContext}`;

    // Do the check if token has expired, once when the login component loads. This is needed
    // for the first time when the page is loaded, to do this check and log user out if
    // login token is expired.
    this.activeRouter.queryParams.subscribe((params) => {

      const validationResult: any = this.readToken(params);

    });
  }


  readToken(params = null): boolean {
    this.fetchAndDecodeCurrentToken(params);
    // Do the check if the stored token has been decoded, and not expired
    if (this.isTokenDecoded && this.decodedToken != null) {
      this.tokenService.saveToken(this.accessToken)
      this.tokenService.saveRefreshToken(this.refreshToken)
      let userSerializer = new UserSerializer()
      let u: User = userSerializer.fromJson(this.decodedToken['user'])
      this.currentUserSubject.next(u);
      return true;
    } else {
      return false
    }

  }


  // Get the token and decode it, store the decoded result in a property
  private fetchAndDecodeCurrentToken(params) {
    // The accessToken from the URL has the precedence in the following || operation
    this.accessToken = ((params != null)
      && params['accessToken'])
      || this.tokenService.getToken();
    this.refreshToken = ((params != null)
      && params['refreshToken'])
      || this.tokenService.getRefreshToken();

    try {
      this.decodedToken = this.jwtHelper.decodeToken(this.accessToken);
      this.isTokenDecoded = true;
    } catch (e) {
      this.isTokenDecoded = false;
    }
  }

  setaLogout() {

    // Revoke the token on backend, by inserting it into list of revoked tokens in MongoDB
    if (this.currentUserSubject.getValue() != null) {

      let un = this.currentUserSubject.getValue().username;

      let url = environment.baseUrl + '/seta-ui/logout';
      let body = {
        username: un,
        accessToken: this.tokenService.getToken()
      };

      this.http.post<any>(url, body).subscribe((r) => {
        if (r.status === 'ok') {
          this.currentUserSubject.next(null);
        }
      });
    }


    this.tokenService.signOut()


  }




}
