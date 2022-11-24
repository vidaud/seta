import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { faUser, faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faCopy, faSquare, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'projects/seta-web/src/environments/environment';
import { Subject } from 'rxjs';
import { User } from '../../models/user.model';
import { AppToastService } from '../../services/app-toast.service';
import { AuthenticationService } from '../../services/authentication.service';
import { RestService } from '../../services/rest.service';
import { RsaKeysService } from '../../services/rsa-keys.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  currentUser: User = null;
  jwtHelper: JwtHelperService;
  displayEcasLogoutLink: boolean = !environment.production && !environment.test
  displaySetaLogoutLink = true;
  displayTestCallsPallete = false;
  http: HttpClient;

  public faUserCircle = faUserCircle;
  public faUser = faUser;
  public faSquare = faSquare;
  public faUserSlash = faUserSlash;
  public faCopy = faCopy;

  environment = environment;

  public loginFormSubject$: Subject<Event> = new Subject();

  private fb: FormBuilder

  @Output()
  isRsaKeyBeingGenerated: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {
    this.authenticationService.currentUserSubject.asObservable().subscribe((currentUser: User) => {
      this.currentUser = currentUser
    })
  }

  logout() {
    this.authenticationService.setaLogout()
    this.router.navigate(['/home']);
  }


  ngOnInit(): void {

    
  }


  goToLink(event: any, link: string) {
    window.location.href = `${environment.baseUrl}${link}`;
    event.preventDefault();
  }

  navigateTo(event: any, link: string) {
    this.router.navigate([`/${link}`]);
  }

  public isUserSet() {
    let is = this.currentUser !== null && this.currentUser.username;

    return is;
  }

}
