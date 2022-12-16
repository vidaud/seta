import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import storageService from './storage.service';

const USER_KEY = 'auth-user';
const AUTH_API = environment.baseUrl + environment.baseApplicationContext + 'v2/';
const currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null!)

class AuthentificationService {

  constructor() {
  if(storageService.isLoggedIn()){
    currentUserSubject.next(storageService.getUser());
  } 
  }
  loadProfile() {
    this.profile().subscribe({
      next: (user: User) => {
        storageService.saveUser(user);
        currentUserSubject.next(user);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  setaLogout() {
    (axios.post(AUTH_API + 'logout', {}) as any).subscribe({
      next: () => {
        currentUserSubject.next(null!);
        storageService.clean();        
      },
      error: err => {
        console.log(err);
      }
    });

  }

  profile(): Observable<User> {
    let response: any = axios.get<User>(AUTH_API + 'user-info');
    return response;
  }

  refreshCookie() {
    return axios.post(AUTH_API + 'refresh', {});
  }
}
export default new AuthentificationService();