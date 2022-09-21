import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, retry, switchMap, take } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { AuthenticationService } from "../services/authentication.service";
import { TokenStorageService } from "../token-storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  baseUrl = environment.baseUrl + environment.baseApplicationContext

  constructor(private tokenService: TokenStorageService,
    private authService: AuthenticationService, private messageService: MessageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let token = this.tokenService.getToken();
    switch (req.url) {
      case this.baseUrl + 'refresh':
        break;
      case this.baseUrl + 'logout':
        token = this.tokenService.getRefreshToken();
        req = this.addTokenHeader(req, token);
        break;
      default:
        if (token != null) {
          req = this.addTokenHeader(req, token);
        }
        break;
    }

    return next.handle(req).pipe(
      retry(1),
      catchError(error => {
        let errorMessage = null;

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else if (error instanceof HttpErrorResponse) {
          errorMessage = `Error Status ${error.status}: ${error.error.error} - ${error.error.message}`;
          return this.handleServerSideError(error, req, next);
        }
        return throwError(error);
      })
    );
  }

  private handleServerSideError(error: HttpErrorResponse,
    request: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {
    switch (error.status) {
      case 401:
      case 403:
      case 422:
        switch (request.url) {
          case this.baseUrl + 'refresh':
            this.isRefreshing = false;
            this.authService.setaLogout()
            return throwError(error);
          case this.baseUrl + 'logout':
            return throwError(error);
          default:
            return this.handle401Error(request, next)
        }
      default:
        this.messageService.add({
          key: 'tl',
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
        return throwError(error);
    }

  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.tokenService.getRefreshToken();
      if (token) {
        return this.authService.getRefreshedAccessToken(token)
          .pipe(
            switchMap((res: any) => {
              this.isRefreshing = false;
              this.tokenService.saveToken(res.jawt);
              this.refreshTokenSubject.next(res.jawt);

              return next.handle(this.addTokenHeader(request, res.jawt));
            })
          );
      }

    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
