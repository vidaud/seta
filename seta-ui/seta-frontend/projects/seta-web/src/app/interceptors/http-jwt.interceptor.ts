import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

/*
The JWT interceptor intercepts the incoming requests from the application/user and adds JWT 
token to the request's Authorization header (Bearer value of Authorization header, to be more
specific), only if the user is logged in. This JWT token in the request header is required 
to access the SECURE API END POINTS on the server 
*/

@Injectable()
export class HttpJwtInterceptor implements HttpInterceptor {
  constructor(private router: Router, private route: ActivatedRoute) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the current user is logged in.
    // If the user who is making the request is logged in, he will have JWT token in its local
    // storage which is set during login process

    let accessToken = localStorage.getItem('accessToken');

    // While intercepting, the accessToken is found and validated, so attach it to http header
    // Clone the incoming request and add JWT token in the new request's Authorization header
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // handle any other requests which went unhandled
    return next.handle(request);
  }
}
