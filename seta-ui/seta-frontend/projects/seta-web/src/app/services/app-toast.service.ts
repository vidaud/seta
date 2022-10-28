import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
// import { ToastType } from '../components/app-toasts/app-toasts.component';


export enum ToastType {
  Success = "successTpl",
  Error = "errorTpl",
  Info = "infoTpl",
  Warning = "warninTpl"
}
export class ToastModel {
  body: string | TemplateRef<any>;
  type?: ToastType
  header?: string | TemplateRef<any>;
  options?: any
  delay: 5000

  constructor(data?: Partial<ToastModel>) {
    Object.assign(this, data);
  }
}

@Injectable({
  providedIn: 'root'
})
export class AppToastService {

  public toasts: ToastModel[] = []
  public toasts_$ = new BehaviorSubject<ToastModel[]>([]);
  public $toasts = this.toasts_$.asObservable();


  show(toast: ToastModel) {
    this.toasts.push(toast);
    this.toasts_$.next([...this.toasts])
  }


  remove(toast) {
    this.toasts = this.toasts.filter(t => t.body != toast.body);
    this.toasts_$.next([...this.toasts])
  }


  // convenience methods
  success(bodyMessage: string | TemplateRef<any>, headerMessage?: string | TemplateRef<any>, options?: any) {
    this.show(new ToastModel({ body: bodyMessage, header: headerMessage, type: ToastType.Success, ...options }))
  }

  error(bodyMessage: string | TemplateRef<any>, headerMessage?: string | TemplateRef<any>, options?: any) {
    this.show(new ToastModel({ body: bodyMessage, header: headerMessage, type: ToastType.Error, ...options }))
  }

  info(bodyMessage: string | TemplateRef<any>, headerMessage?: string | TemplateRef<any>, options?: any) {
    this.show(new ToastModel({ body: bodyMessage, header: headerMessage, type: ToastType.Info, ...options }))
  }

  warn(bodyMessage: string | TemplateRef<any>, headerMessage?: string | TemplateRef<any>, options?: any) {
    this.show(new ToastModel({ body: bodyMessage, header: headerMessage, type: ToastType.Warning, ...options }))
  }

  constructor() { }
}
