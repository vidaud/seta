import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class CanActivateUserGuard implements CanActivate {

  currentUser: User

  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.auth.currentUserSubject.asObservable().subscribe((currentUser: User) => this.currentUser = currentUser)
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.currentUser === null) {
      this.router.navigate(['/home'], { queryParams: { returnUrl: state.url } });
      return false;
    }
    return true;
  }

}