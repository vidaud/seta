import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  getRefreshedAccessToken(token: string) {
    return this.http.post('/refresh', {});
  }

  public currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null)
  public baseUrl;

  constructor(public http: HttpClient, private storageService: StorageService, private activeRouter: ActivatedRoute) {
   
    this.baseUrl = `${environment.baseUrl}${environment.baseApplicationContext}`;

    if(this.storageService.isLoggedIn()){
      this.currentUserSubject.next(this.storageService.getUser());
    }    

    // Check for action param
    //TODO: replace by cookie check
    this.activeRouter.queryParams.subscribe((params) => {

      if(params != null && params['action']){
        switch(params['action']){
          case 'login':{
            this.loadProfile();
            break;
          }
        }
      }

    });
  }
  
  loadProfile() {
    this.profile().subscribe({
      next: (user: User) => {
        this.storageService.saveUser(user);
        this.currentUserSubject.next(user);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  setaLogout() {
    this.http.post('/logout', {}).subscribe({
      next: () => {
        this.currentUserSubject.next(null);
        this.storageService.clean();        
      },
      error: err => {
        console.log(err);
      }
    });

  }

  profile(): Observable<User> {
    return this.http.get<User>('/rest/user-info');
  }

  refreshCookie() {
    return this.http.post('/refresh', {});
  }
}
