import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppToastService } from './app-toast.service';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class RsaKeysService {

  servicedComponent: any
  constructor(private rest: RestService,
    private toastService: AppToastService,
    private http: HttpClient) { }

  public generateRsaKeys(): Observable<any> {
    return this.rest.generateRsaKeys()
  }

  public deleteRsaKeys(): Observable<any> {

    return this.rest.deleteRsaKeys()

  }
}
