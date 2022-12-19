import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { User } from '../models/user.model';
import storageService from './storage.service';

const AUTH_API = environment.baseUrl + environment.baseApplicationContext + 'v2/';

const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6dHJ1ZSwiaWF0IjoxNjcxMTEzNzQ0Ljk5OTM3NTMsImp0aSI6IjBkMjQyMDRlLTBkNGMtNDJlMi04YzFiLTAyNjhhMjU4OWE0ZCIsInR5cGUiOiJhY2Nlc3MiLCJ1c2VybmFtZSI6ImxsZXNhZHIiLCJuYmYiOjE2NzExMTM3NDUsImNzcmYiOiJjNjZlZmEyNy1mMTk0LTQ4ZjEtYmQ1Zi1lMjFjZDllYjc4ZWYiLCJleHAiOjE2NzExMTczNDUsInVzZXIiOnsidXNlcm5hbWUiOiJsbGVzYWRyIiwiZmlyc3RfbmFtZSI6IkFkcmlhbmEiLCJsYXN0X25hbWUiOiJMTEVTSEkiLCJlbWFpbCI6IkFkcmlhbmEuTExFU0hJQGV4dC5lYy5ldXJvcGEuZXUifSwiaXNzIjoiU0VUQSBGbGFzayBzZXJ2ZXIiLCJzdWIiOiJsbGVzYWRyIiwicm9sZSI6InVzZXIiLCJzb3VyY2VfbGltaXQiOnsic291cmNlIjoibGxlc2FkciIsImxpbWl0Ijo1fX0.jJHpKL4r_mRudQhAc-aLGJrx8cPHHhJrWe7GRDQlya8';

class AuthentificationService {
  public currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null!);
  constructor() {
  if(storageService.isLoggedIn()){
    this.currentUserSubject.next(storageService.getUser());
    console.log(this.currentUserSubject);
  } 
  }
  loadProfile() {
    this.profile();
    console.log(this.currentUserSubject);
    // .subscribe({
    //   next: (user: User) => {
    //     console.log(user);
    //     storageService.saveUser(user);
    //     currentUserSubject.next(user);
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   },
    // });
  }

  setaLogout() {
    (axios.post(AUTH_API + 'logout', {}) as any).subscribe({
      next: () => {
        this.currentUserSubject.next(null!);
        storageService.clean();        
      },
      error: err => {
        console.log(err);
      }
    });

  }

  profile(): Observable<User> {
    let response: any = axios
      .get<User>('http://localhost/rest/v1/user-info')
      .then((response) => {
        console.log(response);
        var user = response.data;
        storageService.saveUser(user);
        this.currentUserSubject.next(user);
  })
  .catch((error) => {
    console.log(error);
  });
    console.log(response);

    return this.currentUserSubject;
  }

  refreshCookie() {
    return axios.post(AUTH_API + 'refresh', {});
  }
}
export default new AuthentificationService();