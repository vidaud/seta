import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Select } from '@ngxs/store';
import { environment } from 'projects/seta-web/src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, throttleTime } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { AuthenticationService } from '../../services/authentication.service';
import { SetaApiService } from '../../services/seta-api.service';
import { SetaState } from '../../store/seta.state';

@Component({
  selector: `app-home`,
  templateUrl: `./home.component.html`,
  styleUrls: [`./home.component.scss`],
})
export class HomeComponent implements OnInit {
  @Select(SetaState.term)
  public term$: Observable<string>;

  @Input()
  public toggleSearch = `documents`;

  public faSearch = faSearch;
  public setaForm: FormGroup;
  public saveFile$: Subject<Event> = new Subject();
  public suggestions: string[] = [];

  public isOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public showDropdown = false;
  user: User;

  constructor(
    private setaApiService: SetaApiService,
    private router: Router,
    private auth: AuthenticationService) {
    this.setaForm = new FormGroup({
      searchTerm: new FormControl(``, [Validators.required]),
    });
  }

  toggleSearchChange(toggle: string) {
    this.toggleSearch = toggle;
  }

  stop(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  get searchTerm() {
    return this.setaForm.get(`searchTerm`);
  }

  selectItem(event, suggestion) {
    this.searchTerm.setValue(suggestion);
    this.saveFile$.next(event);
  }

  selectKey(event) {
    event.stopPropagation();
  }

  focusInShow(event) {
    this.isOpen.subscribe((isop) => {
      if (isop) {
        this.showDropdown = true;
      } else {
        this.showDropdown = false;
      }
    });
  }

  goToLink(event: any, link: string) {
    window.open(`${link}`, `_blank`);
    event.preventDefault();
  }

  goToEcas(event: any, link: string) {
    window.location.href = `${environment.baseUrl}${link}`;
    event.preventDefault();
  }

  focusOutShow(event) {
    this.showDropdown = false;
  }

  public ngOnInit() {
    this.searchTerm.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((result) => {
      this.setaApiService.suggestions(new HttpParams().set(`chars`, result)).subscribe((suggestions) => {
        this.suggestions = suggestions;
        this.isOpen.next(this.suggestions.length > 0 ? true : false);
      });
    });

    this.saveFile$.pipe(throttleTime(1000)).subscribe((event: any) => {
      if (this.setaForm.valid) {
        switch (this.toggleSearch) {
          case `words`:
            this.router.navigate([`/findall`, this.searchTerm.value]);
            break;
          case `documents`:
            let payload = this.searchTerm.value.replace(/["']/g, "")
            payload = payload.trim()
            this.router.navigate([`/corpus`, payload.indexOf(` `) !== -1 ? `"${payload}"` : `${payload}`]);
            break;
          default:
            break;
        }

      }
    });

    this.auth.currentUserSubject.asObservable().subscribe((user: User) =>
      this.user = user
    )
  }
}
