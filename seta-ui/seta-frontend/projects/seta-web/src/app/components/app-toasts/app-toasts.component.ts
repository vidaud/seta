import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { AppToastService, ToastModel, ToastType } from '../../services/app-toast.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './app-toasts.component.html',
  styleUrls: ['./app-toasts.component.scss']
})
export class AppToastsComponent implements OnInit {
  toasts: ToastModel[] = []

  @ViewChild('errorTpl', { read: TemplateRef, static: false })
  errorTpl: TemplateRef<any>

  @ViewChild('successTpl', { read: TemplateRef, static: false })
  successTpl: TemplateRef<any>

  @ViewChild('infoTpl', { read: TemplateRef, static: false })
  infoTpl: TemplateRef<any>

  @ViewChild('warninTpl', { read: TemplateRef, static: false })
  warninTpl: TemplateRef<any>


  constructor(public toastService: AppToastService) { }

  faCheck = faCheck
  faInfoCircle = faInfoCircle
  faExclamationTriangle = faExclamationTriangle
  faTimesCircle = faTimesCircle

  isTemplate(textOrTpl) { return textOrTpl instanceof TemplateRef; }

  getTemplate(toast: ToastModel) {
    switch (toast.type) {
      case ToastType.Error:
        return this.errorTpl
        break;
      case ToastType.Success:
        return this.successTpl
        break;
      case ToastType.Warning:
        return this.warninTpl
        break;
      case ToastType.Info:
        return this.infoTpl
        break;
    }
  }


  readonly toastType = ToastType;

  toastTypeClass = {
    [ToastType.Success]: 'success',
    [ToastType.Error]: 'error',
    [ToastType.Info]: 'info',
    [ToastType.Warning]: 'warning',
  }

  ngOnInit(): void {
    this.toastService.$toasts.subscribe((toasts: ToastModel[]) => {
      this.toasts = toasts
    })

  }

}
