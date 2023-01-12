import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import storageService from './storage.service';

const AUTH_API = environment.baseUrl;

class AuthentificationService {
  public currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User| null>(null);
    constructor() {
      if(storageService.isLoggedIn()){
        this.currentUserSubject.next(storageService.getUser());
        console.log(this.currentUserSubject);
      } 
      const searchParam = new URLSearchParams(window.location.hash);
      const action = Object.fromEntries(searchParam.entries());
      console.log(action);
      if(searchParam != null && action['#/home?action'] === 'login'){
          this.loadProfile();
      }
  }

  loadProfile() {
    this.profile();
    console.log(this.currentUserSubject);
  }

  setaLogout() {
    (axios.post(AUTH_API + '/logout', {}) as any).then(() => {
        window.location.href = "/logout/ecas";
        this.currentUserSubject.next(null);
        storageService.clean();    
    });

  }

  profile(): Observable<User | null> {
    axios
      .get<User>(AUTH_API + '/rest/v1/user-info')
      .then((response) => {
        console.log(response);
        var user = response.data;
        storageService.saveUser(user);
        this.currentUserSubject.next(user);
  })
  .catch((error) => {
    console.log(error);
  });
    return this.currentUserSubject;
  }

  refreshCookie() {
    return axios.post(AUTH_API + '/refresh', {});
  }
}
export default new AuthentificationService();