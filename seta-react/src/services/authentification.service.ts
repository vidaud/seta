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
      } 
      const searchParam = new URLSearchParams(window.location.search);
      if(searchParam != null){
        const action = searchParam.get('action');
        console.log(action);
        if(action === 'login'){
            this.loadProfile();
        }
      }      
  }

  loadProfile() {
    this.profile();
  }

  setaLogout() {
    (axios.post(AUTH_API + '/logout', {'Cache-Control': 'no-cache', 'Pragma': 'no-cache'}) as any).then(() => {
        window.location.href = "/logout/ecas";
        this.currentUserSubject.next(null);
        storageService.clean();    
    });

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

  refreshCookie() {
    return axios.post(AUTH_API + '/refresh', {'Cache-Control': 'no-cache', 'Pragma': 'no-cache'});
  }
}
export default new AuthentificationService();