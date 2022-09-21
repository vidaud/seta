import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class RouteMessageService {

  constructor() {

  }

  private _message: string = null;

  get message(): string {
    const returnedMessage = this._message;
    this.clear();
    return returnedMessage;
  }

  set message(val: string) {
    this._message = val;
  }

  clear() {
    this.message = null;
  }

}
