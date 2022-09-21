import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Actions, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, throttleTime } from 'rxjs/operators';
import { SetaApiService } from '../../services/seta-api.service';
import { MainSearch } from '../../store/seta.actions';
import { SetaState } from '../../store/seta.state';

@Component({
  selector: `app-search-form`,
  templateUrl: `./search-form.component.html`,
  styleUrls: [`./search-form.component.scss`],
})
export class SearchFormComponent implements OnInit {
  @Select(SetaState.term)
  public term$: Observable<string>;

  public faSearch = faSearch;
  public setaForm: FormGroup;
  public saveFile$: Subject<Event> = new Subject();
  public suggestions: string[] = [];

  public showDropdown = false;

  public isOutOfFocus = false;

  @Input()
  public clickOutside: EventEmitter<null>;

  public temClose = false;

  constructor(
    private store: Store,
    private setaApiService: SetaApiService,
    private actions$: Actions,
    private router: Router,
  ) {
    this.setaForm = new FormGroup({
      searchTerm: new FormControl(``, [Validators.required]),
    });
  }

  stop(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  close() {
    this.isOutOfFocus = false;
  }

  get searchTerm() {
    return this.setaForm.get(`searchTerm`);
  }

  selectItem(event, suggestion) {
    this.isOutOfFocus = false;
    this.searchTerm.setValue(suggestion);
    this.saveFile$.next(event);
  }

  selectKey(event) {
    event.stopPropagation();
  }

  focusInShow(event) {
    this.isOutOfFocus = true;
  }


  ngOnInit() {

    this.searchTerm.valueChanges.pipe(debounceTime(200), distinctUntilChanged()).subscribe((result) => {
      this.setaApiService.suggestions(new HttpParams().set(`chars`, result)).subscribe((suggestions) => {
        if (!this.temClose) {
          this.suggestions = suggestions;
        }
        this.temClose = false;
      });
    });

    this.saveFile$.pipe(throttleTime(1000)).subscribe((event: any) => {
      if (this.setaForm.valid) {
        this.store.dispatch(new MainSearch(this.searchTerm.value));
        this.suggestions = [];
        this.temClose = true;
      }
    });
  }
}
