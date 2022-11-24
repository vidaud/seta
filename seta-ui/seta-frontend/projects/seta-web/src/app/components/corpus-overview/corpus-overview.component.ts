import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { environment } from 'projects/seta-web/src/environments/environment';
import { Observable } from 'rxjs';
import { SetaDocument } from '../../models/document.model';
import { Term, TermType } from '../../models/term.model';
import { CorpusCentralService, Modes } from '../../services/corpus-central.service';
import { SetaStateCorpus } from '../../store/seta-corpus.state';
import { CorpusMetadata, CorpusSearch, SimilarVoid } from '../../store/seta.actions';

@Component({
  selector: `app-corpus-overview`,
  templateUrl: `./corpus-overview.component.html`,
  styleUrls: [`./corpus-overview.component.scss`],
})
export class CorpusOverviewComponent implements OnInit {
  public regex = environment._regex;

  @Select(SetaStateCorpus.termCorpus)
  public termCorpus$: Observable<Term[]>;

  @Select(SetaStateCorpus.corpusDocuments)
  public corpusDocuments$: Observable<SetaDocument[]>;

  public corpusDocuments: SetaDocument[] = []

  public term: Term[];

  public eurlexMetadataFilters: any;

  public word: Term[];
  public text: any;
  semanticDoc: any;
  mySubscription: any;

  isExpanded1 = false
  isExpanded2 = false
  isExpanded3 = false
  isExpanded4 = true;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private actions$: Actions,
    private corpusCentral: CorpusCentralService) {
    this.termCorpus$.subscribe((term) => (this.term = term));



  }

  /**
   * toggleMode
   */
  public toggleMode(id: number) {
    this.corpusCentral.mode = id
    switch (id) {
      case Modes.Reactive_unassuming:
        this.isExpanded2 = true
        this.isExpanded1 = this.isExpanded3 = this.isExpanded4 = false
        break;
      case Modes.Reactive_assuming:
        this.isExpanded3 = true
        this.isExpanded1 = this.isExpanded2 = this.isExpanded4 = false
        break;
        case Modes.Reactive_hyper_assuming:
          this.isExpanded4 = true
          this.isExpanded1 = this.isExpanded2 = this.isExpanded3 = false
          break;
    }
  }

  public updateEurlexMetadataFilters(eurlexMetadataFilters: any): void {
    this.eurlexMetadataFilters = eurlexMetadataFilters;
  }

  public updateTextFilter(text) {
    this.text = text;
  }


  semanticDocument($event) {
    this.semanticDoc = $event;
  }

  ngOnInit() {

    this.corpusDocuments$.subscribe((corpusDocuments) => {
      this.corpusDocuments = [...corpusDocuments]
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get(`word`)) {
        this.word = [new Term({ display: params.get(`word`).replace(this.regex, ` `), termType: TermType.VERTEX, value: params.get(`word`).replace(this.regex, ` `), isOperator: false })];
      } else if (this.term && this.term.length > 0) {
        this.word = this.term;
      } else {
        this.word = [new Term({ display: `"green deal"`, termType: TermType.VERTEX, value: `green deal`, isOperator: false })];
      }
      this.store.dispatch(new SimilarVoid())
      this.store.dispatch(new CorpusMetadata());
    });
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
