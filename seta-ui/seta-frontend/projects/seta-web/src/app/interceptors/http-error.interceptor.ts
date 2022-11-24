import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor() {

  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let handled: boolean = false;

    return next.handle(request).pipe(
      retry(1),
      catchError((error) => {
        let errorMessage = ``;
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } if (error instanceof HttpErrorResponse) {
          // server-side error
          // errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          errorMessage = `Error Status ${error.status}: ${error.statusText} - ${error.error.msg}`;
          console.log(error)
          handled = this.handleServerSideError(error);
        }
        // window.alert(errorMessage);
        // return throwError(errorMessage);
        console.error(errorMessage ? errorMessage : error);

        if (!handled) {
          if (errorMessage) {
            return throwError(errorMessage);
          } else {
            return throwError("Unexpected problem occurred");
          }
        } else {
          return of(error);
        }

      })
    );
  }

  private handleServerSideError(error: HttpErrorResponse): boolean {
    let handled: boolean = false;

    switch (error.status) {
      case 401:
        // this.routeMessageService.message = "Please login again.";

        handled = true;
        break;
      case 403:
        // this.routeMessageService.message = "Please login again.";

        handled = true;
        break;
    }

    return handled;
  }

}
