import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCheckSquare, faFileCode, faFilePdf, faSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faBrain, faChevronDown, faChevronRight, faCodeBranch, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngxs/store';
import { SetaDocument } from '../../models/document.model';
import { Term } from '../../models/term.model';
import { CorpusCentralService } from '../../services/corpus-central.service';
import { CorpusParamHistoryService } from '../../services/corpus-param-history.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';

@Component({
  selector: 'app-tick-document',
  templateUrl: './tick-document.component.html',
  styleUrls: ['./tick-document.component.scss'],
})
export class TickDocumentComponent implements OnInit {

  @Input()
  public semanticDocument: SetaDocument;

  dynamicQuery: Term[];
  mode: number;
  semantic_id: { id: string | null, disabled: boolean }

  ngOnChanges(semanticDocument: SetaDocument) {
    this.isChecked = true;
  }

  public isCollapsed = true;

  public isChecked = true;

  toBeDeleted: boolean = false;


  public faChevronDown = faChevronDown;
  public faChevronRight = faChevronRight;
  public faPlus = faPlus;
  public faMinus = faMinus;
  public faBrain = faBrain;
  public faCodeBranch = faCodeBranch;
  public faFileCode = faFileCode;
  public faFilePdf = faFilePdf;
  public faTrashAlt = faTrashAlt;
  public faCheckSquare = faCheckSquare;
  public faSquare = faSquare;
  eurlexFilters: CorpusSearchPayload;

  constructor(private corpusHistoryService: CorpusParamHistoryService, private store: Store, private route: ActivatedRoute, private router: Router,
    private corpusCentral: CorpusCentralService) { }

  ngOnInit() {

    this.corpusCentral.dynamicQuery$.subscribe((dynamicQuery) => this.dynamicQuery = dynamicQuery)

    this.corpusCentral.semantic_id$.subscribe((semantic_id) => {
      // console.log(semantic_id)
      this.semantic_id = semantic_id
      if (semantic_id.id !== null) {
        this.isChecked = true
      } else {
        this.isChecked = false
      }
    })

    this.corpusCentral.eurlexFilters.subscribe((eurlexFilters) => {
      this.eurlexFilters = new CorpusSearchPayload({ ...eurlexFilters });
    })

    this.corpusHistoryService.history_sub$.subscribe((history) => {
      if (this.toBeDeleted === true) {
        if (history.length > 0 && history[0].semantic_sort_id === ``) {
          this.semanticDocument = null
        } else {
          this.toBeDeleted = false
          this.corpusCentral.semantic_id = { id: history[0].semantic_sort_id, disabled: false }
        }
      }
    })

    this.corpusCentral.mode$.subscribe((mode) => {
      this.mode = mode
    })
  }

  goToLink(link: string) {
    window.open(link, `_blank`);
  }

  toggleSemanticSort() {
    this.isChecked = !this.isChecked
    this.corpusCentral.sortByDocument(this.isChecked ? this.semanticDocument.id : null)
  }

  deleteSemanticDocument() {
    /* this.corpusCentral.semantic_id = { id: null, disabled: false }
    if (this.dynamicQuery.length === 0) {
      let queryNotNull = this.corpusHistoryService.findQueryNotNull();
      switch (this.mode) {
        case Modes.Lazy:
          this.semanticDocument = null
          this.corpusCentral._semantic_id = null
          this.corpusCentral.eurlexFilters.next(
            new CorpusSearchPayload({ ...queryNotNull, semantic_sort_id: `` }
            )
          )
          break;
        case Modes.Reactive_unassuming:
          this.semanticDocument = null
          this.store.dispatch(new ResetCorpusState())
          this.corpusCentral.eurlexFilters.next(
            new CorpusSearchPayload({ ...this.eurlexFilters, semantic_sort_id: `` }
            )
          )
          return
          break;
        case Modes.Reactive_assuming:
        case Modes.Reactive_hyper_assuming:
          this.toBeDeleted = true
          let newEurlexFilters = new CorpusSearchPayload({ ...this.eurlexFilters })
          newEurlexFilters.semantic_sort_id = ``
          this.corpusCentral.eurlexFilters.next(new CorpusSearchPayload({ ...newEurlexFilters }));
          return;
          break;
      }
    } else {
      this.semanticDocument = null
      this.corpusCentral.eurlexFilters.next(
        new CorpusSearchPayload({ ...this.eurlexFilters, termCorpus: this.dynamicQuery, semantic_sort_id: `` }
        )
      )
    }
    this.corpusCentral.search() */
    this.corpusCentral.semantic_id = { id: null, disabled: false }
    this.toBeDeleted = true
    let newEurlexFilters = new CorpusSearchPayload({ ...this.eurlexFilters, termCorpus: this.dynamicQuery, semantic_sort_id: `` })
    this.corpusCentral.eurlexFilters.next(new CorpusSearchPayload({ ...newEurlexFilters }));
  }

  /**
   * checkIfKeyDocumentApplied
   */
  public checkIfKeyDocumentApplied(): boolean {
    let result = true
    if (this.semantic_id.id !== null) {
      if (this.semantic_id.id === this.corpusHistoryService.getLastState().semantic_sort_id) {
        result = false
      }
    }
    return result
  }

}
