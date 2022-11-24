import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../loading.service';
import { LoadingApp } from '../store/seta.actions';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  private isLoading = false;

  constructor(private store: Store) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.totalRequests++;
    if (!this.isLoading) {
      this.isLoading = true
      this.store.dispatch(new LoadingApp(true));
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.isLoading = false
          this.store.dispatch(new LoadingApp(false));
        }
      })
    );
  }

}