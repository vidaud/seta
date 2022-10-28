import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  baseUrl = environment.baseUrl + environment.baseApplicationContext

  constructor(private authService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {    
    if(req.url.includes('/refresh')){
      const refresh_csrf_token = this.getCookie('refresh_token_cookie');
      req = req.clone({withCredentials: true, headers: req.headers.set('X-CSRF-TOKEN', refresh_csrf_token)});
    }
    else{
      const csrf_token = this.getCookie('csrf_access_token');
      req = req.clone({withCredentials: true, headers: req.headers.set('X-CSRF-TOKEN', csrf_token)});
    }

    return next.handle(req);

    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('/login') &&
          error.status === 401
        ) {
          return this.handle401Error(req, next, error);
        }

        return throwError(() => error);
      })
    );
  }

  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) 
      return parts.pop().split(';').shift();

    return '';
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler, originalError: any): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.authService.refreshCookie().pipe(
        switchMap(() => {
          return next.handle(request);
        }),
        catchError((error) => {  
          //this.authService.setaLogout();
          return throwError(() => originalError);
        })
      );
    }
  }
}
