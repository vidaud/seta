import { Component, OnInit } from '@angular/core';
import { faAngleDown, faCheck, faCheckSquare, faFile, faSquare } from '@fortawesome/free-solid-svg-icons';
import { Actions, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SetaDocument } from '../../models/document.model';
import { SetaState } from '../../store/seta.state';
declare var $: any;

@Component({
  selector: `app-corpus`,
  templateUrl: `./corpus.component.html`,
  styleUrls: [`./corpus.component.scss`],
})
export class CorpusComponent implements OnInit {

  public faFile = faFile;
  public faAngleDown = faAngleDown;
  public faCheck = faCheck;
  public faSquare = faSquare;
  public faCheckSquare = faCheckSquare;

  @Select(SetaState.corpusDocuments)
  public corpusDocuments$: Observable<SetaDocument[]>;

  @Select(SetaState.term)
  public term$: Observable<string>;

  // @Input()
  // public loading = false;

  constructor(private actions$: Actions) {
    // this.actions$.pipe(ofActionDispatched(CorpusSearch)).subscribe((payload) => {
    //   this.loading = true;
    // });
    // this.actions$.pipe(ofActionSuccessful(CorpusSearch)).subscribe((payload) => {
    //   this.loading = false;
    // });
  }


  ngOnInit() {
  }
}
