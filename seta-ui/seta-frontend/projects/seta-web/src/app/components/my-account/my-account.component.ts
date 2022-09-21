import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faRedo, faTrashAlt, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { defaultNoPublicKeyMessage } from '../../common/constants';
import { User } from '../../models/user.model';
import { AppToastService } from '../../services/app-toast.service';
import { AuthenticationService } from '../../services/authentication.service';
import { RestService } from '../../services/rest.service';
import { RsaKeysService } from '../../services/rsa-keys.service';
import { TreeInputModel } from '../dynamic-tree/tree-input.model';
import { NgbdModalConfirm } from '../modals/modals';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  user: any = {};
  publicKey: string
  userData: User = null;
  public faTrashAlt = faTrashAlt
  public faRedo = faRedo
  public faUserSlash = faUserSlash


  items: TreeInputModel[] = [
    {
      name: 'My queries',
      children: [
        {
          name: 'Equality',
          children: [{ name: 'Equality child' }, { name: 'Equality child 2' }]
        },
        {
          name: 'Bias',
          children: [
            {
              name: 'Gender',
              children: [],
            },
            {
              name: 'Racial',
              children: [],
            },
            {
              name: 'Social',
              children: [],
            },
            {
              name: '',
            },
          ],
        },
        {
          name: 'CO2',
        },
        {
          name: 'Equality',
          children: [],
        },
        {
          name: 'Light',
          children: [],
        },
        {
          name: '',
        },
      ],
    },
  ];

  constructor(private auth: AuthenticationService,
    private toastService: AppToastService,
    private rest: RestService,
    private rsaKeysService: RsaKeysService,
    private _modalService: NgbModal, private router: Router) {

  }

  ngOnInit(): void {

    let myUser = {}
    this.auth.currentUserSubject.asObservable().subscribe((user: User) => {
      if (user === null) {
        this.router.navigate(['/home']);
      } else {
        myUser["last name"] = user.lastName
        myUser["first name"] = user.firstName
        myUser["email"] = user.email
        myUser["username"] = user.username
        this.rest.getPublicRsaKey(user.username).subscribe((r) => {

          this.publicKey = r.value;

        })
        this.user = myUser
        this.userData = user
      }
    })
  }

  public generateRsaKeys() {
    this.rsaKeysService.generateRsaKeys().subscribe((r) => {
      this.downLoadFile(r['privateKey'], 'text/plain', `id_rsa`);
      this.toastService.success('RSA key pair successfully generated!');
      this.publicKey = r.publicKey;
    })

  }

  public deleteRsaKey() {
    this.rsaKeysService.deleteRsaKeys().subscribe((r) => {
      this.toastService.success('RSA key pair successfully deleted!');
      this.publicKey = defaultNoPublicKeyMessage;
    });
  }

  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param headers - request Headers
   */
  downLoadFile(data: any, headers: any, filename: string) {
    const link = document.createElement(`a`);
    const blob = new Blob([data], { type: (typeof headers) === 'object' ? headers.get(`Content-Type`) : headers });
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  open() {
    const modalRef = this._modalService.open(NgbdModalConfirm);
    modalRef.componentInstance.username = this.userData.username;
    modalRef.result.then(() => {
      this.deleteUser()
    });
  }

  public deleteUser() {
    this.rest.deleteCurrentUserAccount();
  }

}
