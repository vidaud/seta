import { AfterContentInit, AfterViewChecked, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { filter } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';



@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header alert-warning">
      <h4 class="modal-title">WARNING!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <h1 class="h1">Your web browser is out of date or not supported.</h1>
      <h1 class="h1" style="text-align: center;">{{browser}}</h1>
      <h2 class="h2">To correctly visualize this website it is recommended to upgrade your browser to the latest version available </h2>
      <h2 class="h2">Please download one of the following browsers:</h2>
      <div class="card-deck">
        <div class="card" id="chrome">
          <a (click)="goToLink($event, 'https://www.google.com/chrome')" title="Google Chrome">
            <div class="icon"></div>
          </a>
        </div>
        <div class="card" id="firefox">
          <a (click)="goToLink($event, 'https://www.mozilla.org/firefox/')" title="Firefox">
            <div class="icon"></div>
          </a>
        </div>
        <div class="card" id="edge">
          <a (click)="goToLink($event, 'https://www.microsoft.com/edge/')" title="Edge">
            <div class="icon"></div>
          </a>
        </div>
      </div>
    </div>
    <div class="modal-footer alert-warning">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `,
  styles: [`.icon {
    width: 125px;
    height: 135px;
    margin: 20px auto;
    background-image: url(../assets/browsehappy-sprite.png);
    background-repeat: no-repeat; cursor: pointer}`,
    `#chrome .icon {background-position: 0 0;}`, `#firefox .icon {
    background-position: -125px 0;}`,
    `#edge .icon {background-position: -625px 0;}`
  ]
})
export class NgbdModalContent {
  @Input() browser;

  constructor(public activeModal: NgbActiveModal) { }

  goToLink(event: any, link: string) {
    window.open(`${link}`, `_blank`);
    event.preventDefault();
  }
}

@Component({
  selector: `app-root`,
  templateUrl: `./app.component.html`,
  styleUrls: [`./app.component.scss`],
  providers: [MessageService]
})
export class AppComponent implements OnInit {

  footerContainerVisibility = false;
  deviceInfo = null;
  closeResult = '';


  constructor(
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private modalService: NgbModal,
    private dynamicScriptLoader: DynamicScriptLoaderService) {
    

    router.events.pipe(filter((ev) => ev instanceof NavigationEnd)).subscribe((ev: NavigationEnd) => {
      switch (ev.urlAfterRedirects) {
        case `/home`:
          this.footerContainerVisibility = true;
          break;
        default:
          this.footerContainerVisibility = false;
          break;
      }
    });

  }
  
  searchForm: any;
  title = `seta-new`;

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    if (this.deviceService.isDesktop()) {
      if (this.deviceService.browser === `IE` || this.deviceService.browser === `MS-Edge`) {
        this.openModal();
      }
    }
    this.loadScripts();


  }

  openModal() {
    const modalRef = this.modalService.open(NgbdModalContent, { size: 'xl' });
    modalRef.componentInstance.browser = this.epicFunction();
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    return `${this.deviceInfo.browser} ${this.deviceInfo.browser_version}`
  }

  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dynamicScriptLoader.loadScript(`cookiejs`).then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }
}
