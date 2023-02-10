import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import storageService from './storage.service';
import restService from './rest.service';

const AUTH_API = environment.baseUrl;

class AuthentificationService {
  public currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User| null>(null);

  getRefreshedAccessToken(token: string) {
    return axios.post(AUTH_API + 'refresh', {});
  }

  constructor() {
    if(storageService.isLoggedIn()){
      this.currentUserSubject.next(storageService.getUser());
    }
    const searchParam = new URLSearchParams(window.location.search);
    if(searchParam != null){
      const action = searchParam.get('action');
      if(action === 'login'){
        this.loadProfile();
      }
    }      
  }

  loadProfile() {
    this.profile();
  }

  setaLogout() {
    (axios.post(AUTH_API + '/logout', {'Cache-Control': 'no-cache', 'Pragma': 'no-cache'}) as any)
    .then(() => {
      window.location.href = "/logout/ecas";
      this.currentUserSubject.next(null);
      storageService.clean();    
    });
  }

  setaLocalLogout() {
    (axios.post(AUTH_API + '/logout', {'Cache-Control': 'no-cache', 'Pragma': 'no-cache'}))
    .then(() => {
      window.location.href = "/login";  
    }) as any;
  }

  profile(): Observable<User | null> {
    axios
      .get<User>(AUTH_API + '/rest/v1/user-info')
      .then((response) => {
        var user = response.data;
        storageService.saveUser(user);
        this.currentUserSubject.next(user);
      })
      .catch((error) => {
        console.log(error);
      });
    return this.currentUserSubject;
  }

  async refreshToken(): Promise<any> {
    const csrf_token = restService.getCookie('csrf_refresh_token');
      return axios.get(AUTH_API + '/refresh', {
        headers:{"X-CSRF-TOKEN": csrf_token}
      })
      .then((response: any) => {
        return response;
      })
      .catch((error) => {
        if (error.response) {
          if(error.response.status === 401){
            //redirect to logout
            this.setaLocalLogout();
          }
        }
      }) as any;
  }
}
export default new AuthentificationService();