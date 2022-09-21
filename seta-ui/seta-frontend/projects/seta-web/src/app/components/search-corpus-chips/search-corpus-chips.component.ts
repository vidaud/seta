import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faClone,
  faCopy,
  faFileExcel,
  faQuestionCircle,
  faTrashAlt,
  faWindowClose
} from '@fortawesome/free-regular-svg-icons';
import { faEllipsisV, faFile, faFileUpload, faFilter, faRedo, faSave, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbDropdown, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, throttleTime } from 'rxjs/operators';
import { forbiddenNameValidator2, isRequired } from '../../directives/checkSyntax.directive';
import { SetaCorpus } from '../../models/corpus.model';
import { SetaDocument } from '../../models/document.model';
import { EurovocThesaurusModel } from '../../models/eurovoc-thesaurus.model';
import { MongoQueryModel } from '../../models/mongo-query.model';
import { Operators, Term, TermType } from '../../models/term.model';
import { User } from '../../models/user.model';
import { Vertex } from '../../models/vertex.model';
import { SetaDocumentsForExport } from '../../serializers/seta-export-corpus.serializer';
import { AppToastService } from '../../services/app-toast.service';
import { AuthenticationService } from '../../services/authentication.service';
import { CorpusCentralService, Modes } from '../../services/corpus-central.service';
import { CorpusParamHistoryService } from '../../services/corpus-param-history.service';
import { RestService } from '../../services/rest.service';
import { SetaApiService } from '../../services/seta-api.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
import { SetaStateCorpus } from '../../store/seta-corpus.state';
import { ClearSearchTerms, SimilarSearch } from '../../store/seta.actions';
import { SetaAdvancedFiltersComponent } from '../seta-advanced-filters/seta-advanced-filters.component';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';

@Component({
  selector: 'app-search-corpus-chips',
  templateUrl: './search-corpus-chips.component.html',
  styleUrls: ['./search-corpus-chips.component.scss'],
})
export class SearchCorpusChipsComponent implements OnInit {
  form: FormGroup;
  saveQueryForm: FormGroup;
  loadQueryForm: FormGroup;
  submitted = false;
  eurlexMetadata$: any;
  resourceTypeDtos: any[];
  documentSectors: any[];
  subjectTypeDtos: any[];
  actCategoriesDto: any[];
  eurovocThesaurusConcepts: EurovocThesaurusModel[];
  eurovocDomMapDto: any;
  checksFirstColumn: any;
  filterCounter: number;
  placeholder = '+ Add new item...';
  secondaryPlaceholder = '+ Add new item...';
  dynamicQuery: Term[];


  public rows: TreeNode[] = [];
  public temp: MongoQueryModel[] = [];


  public faFileExcel = faFileExcel;
  public faTimes = faTimes;
  cp: CorpusSearchPayload;
  eurlexFilters: CorpusSearchPayload;
  modalRef: NgbModalRef;
  isFocusOnQuery: boolean;
  isFocusOnQueryBlue: boolean;
  isFocusOnQueryRed: boolean;
  totalElements: number;
  mode: number;
  semantic_id: { id: string | null; disabled: boolean };
  vertexes = [];

  @ViewChildren(NgbDropdown)
  dropdowns: QueryList<NgbDropdown>
  private dropdown: NgbDropdown;

  @ViewChild(NgbDropdown, { static: true })
  public drop1: NgbDropdown;

  @ViewChild(NgbDropdown, { static: true })
  public drop0: NgbDropdown;

  dropdownClickEeventSubject: Subject<void> = new Subject<void>();
  semantic_document: SetaDocument;

  constructor(
    private store: Store,
    private toastService: AppToastService,
    private setaApiService: SetaApiService,
    private corpusCentral: CorpusCentralService,
    private historyService: CorpusParamHistoryService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _authService: AuthenticationService,
  ) {

    // READY to build form
    this.form = this.fb.group({
      chips: [[], [isRequired(this.corpusCentral), forbiddenNameValidator2()]],
    });
  }

  public get authService(): AuthenticationService {
    return this._authService;
  }

  public corpusFormSubject$: Subject<Event> = new Subject();
  public saveQueryFormSubject$: Subject<Event> = new Subject();
  public loadQueryFormSubject$: Subject<Event> = new Subject();

  public validators = [this.startsWithQuotes];

  public errorMessages = {
    startsWithQuotes: 'Quotes must be placed at the beginning and at the end of a phrase',
  };

  inputText = ``;

  itemClick = false

  splitPattern = /\w+|"[^"]+"/g;
  splitpattern4 = /\s+(?=([^"]*"[^"]*")*[^"]*$)/g;
  splitpattern5 = /\w+|"[^"]+"/g;
  splitpattern6 = /\s+(?=(?:[^\'"]*[\'"][^\'"]*[\'"])*[^\'"]*$)/g;

  private _currentUser: User = null;
  public get currentUser(): User {
    return this._currentUser;
  }
  public set currentUser(value: User) {
    this._currentUser = value;
  }
  public faClone = faClone;
  public faCopy = faCopy;
  public faWindowClose = faWindowClose;
  public faSearch = faSearch;
  public faFilter = faFilter;
  public faQuestionCircle = faQuestionCircle;
  public faSave = faSave;
  public faRedo = faRedo;
  public faEllipsisV = faEllipsisV;
  public faTrashAlt = faTrashAlt;
  public faFile = faFile;
  public faFileUpload = faFileUpload;
  


  @Select(SetaStateCorpus.corpusSearchPayload)
  public corpusParameters$: Observable<CorpusSearchPayload>;

  @Select(SetaStateCorpus.vertexes)
  vertexes$: Observable<Vertex[]>;

  @Select(SetaStateCorpus.total_docs)
  public total_docs$: Observable<number>;


  ngOnInit(): void {
    this.corpusCentral.semantic_document$.subscribe((semantic_document) => { this.semantic_document = semantic_document })

    this.corpusCentral.dynamicQuery$.subscribe((dynamicQuery) => this.dynamicQuery = dynamicQuery)

    this.authService.currentUserSubject.asObservable().subscribe((currentUser) => this.currentUser = currentUser)

    this.corpusCentral.mode$.subscribe((mode) => {
      this.mode = mode;
    });

    this.corpusCentral.semantic_id$.subscribe((semantic_id) => {
      this.semantic_id = semantic_id;
    });

    this.total_docs$.subscribe((total_docs) => (this.totalElements = total_docs));

    // ** CorpusSearch terms and filters */

    this.corpusFormSubject$.pipe(throttleTime(500)).subscribe((event: any) => {
      this.applySearch();
    });

    this.saveQueryFormSubject$.pipe(throttleTime(500)).subscribe((event: any) => {


      this.corpusCentral.saveQuery(this.queryNameToSave.value)
      this.toastService.success('Saved!');

    });



    this.corpusParameters$.subscribe((corpusParameters: CorpusSearchPayload) => {
      this.cp = new CorpusSearchPayload({ ...corpusParameters });
      console.log(this.cp.termCorpus);
       
      try {
        this.chips.patchValue(this.cp.termCorpus);
      } catch (e) {
      }

    });



    // READY to build form
    this.saveQueryForm = this.fb.group({
      name: '',
    });

    this.loadQueryForm = this.fb.group({
      name: '',
    });

    this.corpusCentral.eurlexFilters.subscribe((eurlexFilters) => {
      if (eurlexFilters) {
        if (eurlexFilters.termCorpus) {
          this.corpusCentral.dynamicQuery = eurlexFilters.termCorpus;
          this.form.get(`chips`).patchValue([...eurlexFilters.termCorpus]);
        }
        this.eurlexFilters = new CorpusSearchPayload({ ...eurlexFilters });
      }
    });

    this.chips.valueChanges.subscribe((val: Term[]) => {
      this.submitted = false;
      if (!this.form.invalid) {
        this.corpusCentral.dynamicQuery = val;
      }
      this.eurlexFilters = new CorpusSearchPayload({ ...this.eurlexFilters, termCorpus: val });
    });

    this.corpusCentral.filterCounter.subscribe((eurlexCounter) => {
      this.filterCounter = eurlexCounter;
    });

    this.vertexes$.subscribe((vertexes) => {
      let newTermCorpus = vertexes.map((vert) => {
        if (vert.similarWord.indexOf(` `) !== -1 && vert.similarWord.match(/["']/g) === null) {
          return { display: `"${vert.similarWord}"`, value: vert.similarWord };
        } else {
          return { display: `${vert.similarWord}`, value: vert.similarWord };
        }
      });
      newTermCorpus = newTermCorpus.slice(0, 16);
      return (this.vertexes = newTermCorpus.filter((vert) => {
        return this.chips.value.every((value) => value.display !== vert.display);
      }));
    });
  }


  saveQuery(nodes: TreeNode[]) {
    this.corpusCentral.saveQuery(nodes)
  }

  applySearch() {

    this.submitted = true;

    // stop here if form is invalid, or no chips entered
    if (this.form.invalid) {
      return;
    }
    let newPayload;

    switch (this.mode) {
      case Modes.Reactive_unassuming:
      case Modes.Reactive_assuming:
        newPayload = new CorpusSearchPayload({
          ...this.eurlexFilters,
          termCorpus: this.chips.value,
        });
        break;
      case Modes.Reactive_hyper_assuming:
        if (this.chips.value.length === 0 && this.semantic_document.id === null) {
          if (this.semantic_id.disabled === true) {
            this.corpusCentral.semantic_id =
              this.corpusCentral.getLastState().semantic_sort_id === ``
                ? { id: null, disabled: true }
                : { id: this.corpusCentral.getLastState().semantic_sort_id, disabled: true };
            newPayload = new CorpusSearchPayload({
              ...this.eurlexFilters,
              semantic_sort_id: this.corpusCentral.getLastState().semantic_sort_id,
              termCorpus: this.corpusCentral.getLastState().termCorpus,
            });
          } else {
            let lastState = this.historyService.getLastState();

            // The following line causes TAIGA issue #28
            newPayload = new CorpusSearchPayload({ ...lastState });
          }
        } else {
          newPayload = new CorpusSearchPayload({
            ...this.eurlexFilters,
            semantic_sort_id: this.semantic_id.id !== null ? this.semantic_id.id : ``,
            termCorpus: this.chips.value,
          });
        }

        break;
    }
    this.executeQuery(newPayload)
  }

  private startsWithQuotes(control: FormControl) {
    /*Check if there is a pair of quotes*/
    const areQuotesPresent = control.value.match('"') !== null ? true : false;
    if (areQuotesPresent) {
      const startQuote = control.value.indexOf('"');
      if (startQuote === 0) {
        const finalQuote = control.value.indexOf('"', 1);
        if (control.value.length >= 3 && finalQuote !== startQuote && finalQuote !== -1) {
          if (control.value.length - 1 > finalQuote) {
            return {
              startsWithQuotes: true,
            };
          }
        }
      } else {
        return {
          startsWithQuotes: true,
        };
      }
    }
    return null;
  }


  actCategoryMap(actCategoryMap: any, arg1: { [x: number]: any }) {
    throw new Error('Method not implemented.');
  }

  get chips() {
    return this.form.get(`chips`) as FormControl;
  }

  get queryNameToSave() {
    return this.saveQueryForm.get(`name`) as FormControl;
  }

  get queryNameToLoad() {
    return this.loadQueryForm.get(`name`) as FormControl;
  }

  public requestAutocompleteItemsFake = (text: string): Observable<string[]> => {
    return this.setaApiService.suggestions(new HttpParams().set(`chars`, text)).pipe(
      catchError(() => of([])), // empty list on error
      map((sugg: string[]): string[] => sugg),
      // tap(() => (this.suggestionsLoading = false)
      // )
    );
  };

  public copyItem(item: any) {
    this.copyToClipboard(item);
  }

  copyQuery() {
    const payload = new CorpusSearchPayload({
      termCorpus: this.chips.value,
      source: [`eurlex`],
      ndocs: 10,
      from_doc: 0,
    });
    this.copyToClipboard(payload.getSelectedTerms(payload.termCorpus));
    this.showStandard();
  }

  public copyToClipboard(item: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = item;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  public onAdd(event) {
    if (!event.isOperator) {
      this.similarSearch(event);
    }
  }

  public onSelect(event) {
    if (!event.isOperator) {
      this.similarSearch(event);
    }
  }

  private similarSearch(event: any) {
    this.store.dispatch(new SimilarSearch(event.value.replace(/^"|"$/g, ''), 15));
  }

  public transform(textInput: string | { display: string; value: string }): Observable<object> {
    this.submitted = false;
    let item = null;
    // is it a string?
    if (typeof textInput === `string`) {
      // is it an operator?
      if (textInput === `AND`) {
        item = new Term({
          display: `${textInput}`,
          termType: TermType.OPERATOR,
          value: `${textInput}`,
          isOperator: true,
          operator: Operators.properties[Operators.AND],
        });
      } else {
        /*Check if there is a pair of quotes*/
        const areQuotesPresent = textInput.match('"') !== null ? true : false;
        // are quotes present?
        if (areQuotesPresent) {
          const startQuote = textInput.indexOf('"');
          const finalQuote = textInput.indexOf('"', textInput.length - 1);
          if (startQuote === 0) {
            if (textInput.length >= 3 && finalQuote === textInput.length - 1) {
              item = new Term({
                display: `${textInput}`,
                termType: TermType.VERTEX,
                value: textInput.replace(/^"|"$/g, ''),
                isOperator: false,
              });
            }
          }
        } else {
          item = new Term({
            display: textInput.indexOf(`-`) !== -1 ? `"${textInput}"` : `${textInput}`,
            termType: TermType.VERTEX,
            value: textInput.replace(/^"|"$/g, ''),
            isOperator: false,
          });
        }
      }
    } else {
      // is it an operator?
      if (textInput.display === `AND`) {
        item = new Term({
          display: `${textInput.display}`,
          termType: TermType.OPERATOR,
          value: textInput.value.replace(/^"|"$/g, ''),
          isOperator: true,
          operator: Operators.properties[Operators.AND],
        });
      } else {
        item = new Term({
          display: textInput.display.indexOf(` `) !== -1 ?
            (textInput.display.match("\"") !== null ? true : false)
              ?
              `${textInput.display}`
              // textInput.display.indexOf(`-`) !== -1 ? `"${textInput.display}"` : `${textInput.display}`
              :
              `"${textInput.display}"`
            :
            textInput.display.indexOf(`-`) !== -1 ? `"${textInput.display}"` : `${textInput.display}`
          ,
          termType: TermType.VERTEX,
          value: textInput.value.replace(/^"|"$/g, ''), isOperator: false
        });
      }
    }

    if (item === null) {
      this.inputText = textInput + ` `;
      return of();
    } else {
      this.inputText = ``;
    }


    return of(item);
  }

  // ----------------- DO NOT REMOVE -----------------
  /**
   * Method to export a determined number of document records in excel format
   * Missing backend python code
   */
  downloadExcel() {
    // this.isLoading.emit(true);
    const lastPayload = new CorpusSearchPayload({ ...this.cp, ndocs: 10 });
    this.setaApiService.corpus(lastPayload).subscribe((corpusDocument: SetaCorpus) => {
      if (corpusDocument && corpusDocument.documents.length > 0) {
        const lighterDocuments = corpusDocument.documents.map((doc: SetaDocument) => {
          return new SetaDocument({
            ...doc,
            highlight: undefined,
          });
        });
        const body = new SetaDocumentsForExport();
        body.documents = lighterDocuments;
        this.setaApiService.exportExcel(body).subscribe(
          (response) => this.downLoadFile(response.body, response.headers, `export.xlsx`),
          (error) => console.log(`Error downloading the file.`),
          () => {
            // this.isLoading.emit(false);
          }
        );
      }
    });
  }

  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param headers - request Headers
   */
  downLoadFile(data: any, headers: HttpHeaders, filename: string) {
    // if (window.navigator.msSaveOrOpenBlob) {
    //   // For IE:
    //   navigator.msSaveBlob(data, filename);
    // } else {
    // For other browsers:
    const link = document.createElement(`a`);
    const blob = new Blob([data], { type: headers.get(`Content-Type`) });
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
    // }
  }

  // ----------------- DO NOT REMOVE -----------------

  openXl() {
    this.modalRef = this.modalService.open(SetaAdvancedFiltersComponent, { size: 'xl' });
  }

  openXl2() {
    this.modalRef = this.modalService.open(UploadDocumentComponent, { size: 'xl' });
  }

  showStandard() {
    this.toastService.success('Copied!!');
  }


  cleanAllChips() {

    this.chips.patchValue([]);
    this.store.dispatch(new ClearSearchTerms());

  }

  toggleQueryFocusStyle(event) {
    this.isFocusOnQuery = event;
  }

  toggleQueryFocusStyleBlue() {
    let result = false;
    if (this.isFocusOnQuery) {
      if (this.chips.value.length !== 0 || (this.semantic_id.id !== null && this.semantic_id.disabled !== false)) {
        result = true;
      }
    }
    return result;
  }

  toggleQueryFocusStyleRed() {
    let result = false;
    if (this.isFocusOnQuery) {
      if (this.semantic_id.id === null && this.semantic_id.disabled === false && this.chips.value.length === 0) {
        result = true;
      }
    }
    return result;
  }

  checkIfKeyDocumentApplied(): boolean {
    let result = false;
    if (this.semantic_id.id === null && this.semantic_id.disabled === false && this.chips.value.length === 0) {
      result = true;
    }

    return result;
  }


  checkDropDown(dropdown: any) {
    // Check which dropdown was clicked
    this.dropdown = this.dropdowns.find(x => (x as any)._elementRef.nativeElement == dropdown)
    // Check if the clicked dropdown is open
    if (this.dropdown.isOpen()) {
      this.corpusCentral.loadPastCorpusQueries().subscribe((resp: TreeNode[]) => {
        this.dropdownClickEeventSubject.next();
        if (resp === null || resp.length === 0) {
          this.rows = [{
            "label": "My queries",
            "expanded": true,
            "data": "",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
            leaf: false,
            "children": []
          }
          ]
        } else {
          this.rows = resp
        }
      })
    }
  }


  deleteQueryByName(key: string) {
    // if (this.isUserLoggedIn()) {
    this.corpusCentral.deleteStateByName(key).subscribe((result) => {
      let message = result ? 'State deleted!' : 'You are not logged in!'
      if (message === 'State deleted!') {
        this.toastService.success(message)
      }
    })
    // }
  }


  executeQuery(curpusSearchPayload: CorpusSearchPayload) {
    if (curpusSearchPayload && curpusSearchPayload !== null) {
      this.corpusCentral.eurlexFilters.next(curpusSearchPayload);
      this.corpusCentral.search();
      this.drop0.close();
    }
  }

  toggleDropdown(dropdown) {
    console.log(dropdown)
    if (!dropdown.isOpen() && this.itemClick) {
      dropdown.open()
    }
    this.itemClick = false
  }

  removeItem(item: Term, index) {
    if (item.termType === TermType.DOCUMENT) {
      this.corpusCentral.semantic_id = { id: null, disabled: false }
      // this.toBeDeleted = true
      let newEurlexFilters = new CorpusSearchPayload({ ...this.eurlexFilters, termCorpus: this.dynamicQuery, semantic_sort_id: `` })
      this.corpusCentral.eurlexFilters.next(new CorpusSearchPayload({ ...newEurlexFilters }));
    }
    let vertexes: any[] = [...this.chips.value]
    vertexes.splice(index, 1)
    this.chips.patchValue([...vertexes])
  }

}
