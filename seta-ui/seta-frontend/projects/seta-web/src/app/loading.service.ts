import { Injectable } from '@angular/core';
import { BehaviorSubject, defer, NEVER, Subject } from 'rxjs';
import { finalize, share } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  public isLoading$$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();
  
  setLoading(isLoading: boolean) {
    this.isLoading$$.next(isLoading);
  }

}