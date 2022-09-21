import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AdvancedFiltersModel } from '../models/advanced-filters.model';
import { SetaDocument } from '../models/document.model';
import { EurlexFormModel } from '../models/eurlex-form.model';
import { QueryModel } from '../models/query.model';
import { Term } from '../models/term.model';
import { User } from '../models/user.model';
import { CorpusSearchPayload } from '../store/corpus-search-payload';
import { CorpusSearch } from '../store/seta.actions';
import { AuthenticationService } from './authentication.service';
import { CorpusParamHistoryService } from './corpus-param-history.service';
import { RestService } from './rest.service';


export enum Modes {
  Lazy = 1,
  Reactive_unassuming = 2,
  Reactive_assuming = 3,
  Reactive_hyper_assuming = 4
}

@Injectable({
  providedIn: 'root'
})
export class CorpusCentralService {

  currentUser: User = null;

  public eurovocTreeNode = new BehaviorSubject<string[]>([]);
  public partialSelectedEurovoc = new BehaviorSubject<string[]>([]);

  public directoryTreeNode = new BehaviorSubject<string[]>([]);
  public partialSelectedDirectory = new BehaviorSubject<string[]>([]);

  private _dynamicQuery = new BehaviorSubject<Term[]>([]);
  public _dynamicQuery$ = this._dynamicQuery.asObservable();

  public eurlexFilters = new BehaviorSubject<CorpusSearchPayload>(null);
  public formMemory = new BehaviorSubject<AdvancedFiltersModel>(null);

  filterCounter = new BehaviorSubject<number>(0);

  public _semantic_id = new BehaviorSubject<{ id: string | null, disabled: boolean }>({ id: null, disabled: false });
  private _semantic_id$ = this._semantic_id.asObservable()

  public _semantic_document = new BehaviorSubject<SetaDocument>(null);
  private _semantic_document$ = this._semantic_document.asObservable()

  public _mode = new BehaviorSubject<number>(Modes.Reactive_hyper_assuming);
  private _mode$ = this._mode.asObservable();
  
  public get mode$() {
    return this._mode$;
  }
  public set mode(value: number) {
    this._mode.next(value);
  }

  public get semantic_id$() {
    return this._semantic_id$;
  }
  public set semantic_id(value) {
    this._semantic_id.next(value)
  }

  public get semantic_document$() {
    return this._semantic_document$;
  }
  public set semantic_document(value) {
    this._semantic_document.next(value)
  }

  public get dynamicQuery$() {
    return this._dynamicQuery$;
  }

  public set dynamicQuery(value) {
    this._dynamicQuery.next(value);
  }

  constructor(
    private store: Store,
    private corpusHistoryService: CorpusParamHistoryService,
    private rest: RestService,
    private authService: AuthenticationService,) {
      this.authService.currentUserSubject.asObservable().subscribe((currentUser: User) => this.currentUser = currentUser)
    this.formMemory.subscribe((mem) => {
      if (mem
        && mem !== null
        && mem.eurlexForm
        && mem.eurlexForm.eurlexMetadataFilters) {
        this.countNumberOfEurlexMetadataApplied(mem)
      } else {
        this.filterCounter.next(0)
      }
    })
  }

  public search() {

    let eurlexfil = this.eurlexFilters.getValue();
    const source = eurlexfil.source;
    const lastState = this.getLastState()
    let corpusSearchPayload = new CorpusSearchPayload(
      {
        ...eurlexfil,
        source: eurlexfil.source && eurlexfil.source !== null ? eurlexfil.source : [`eurlex`],
        ndocs: eurlexfil.ndocs && eurlexfil.ndocs != null ? eurlexfil.ndocs : 10
      }
    )

    if (this.formMemory.value !== null) {
      this.setCorpusHistoryFilters(this.formMemory.getValue());
    }

    if (!this.corpusHistoryService.arePayloadsEqual(corpusSearchPayload, lastState)) {
      corpusSearchPayload = new CorpusSearchPayload(
        {
          ...corpusSearchPayload,
          ndocs: 10, from_doc: 0, sort: []
        }
      )
    }

    this.store.dispatch(
      new CorpusSearch(
        corpusSearchPayload
      ));

  }

  private setCorpusHistoryFilters(filters: AdvancedFiltersModel) {
    this.corpusHistoryService.eurlexForm_lastExecutionState = new AdvancedFiltersModel(
      {
        selectedRepositoryTypes: filters.selectedRepositoryTypes,
        eurlexForm: new EurlexFormModel({
          eurlexMetadataFilters: { ...filters.eurlexForm.eurlexMetadataFilters },
          eurovocTreeNode: [...filters.eurlexForm.eurovocTreeNode],
          directoryTreeNode: [...filters.eurlexForm.directoryTreeNode],
        })
      }
    );
  }

  public getLastState() {
    return this.corpusHistoryService.getLastState();
  }

  checkIfSemanticSortingIsEnabled(eurlexfil: CorpusSearchPayload) {
    if (
      eurlexfil.semantic_sort_id
      && eurlexfil.semantic_sort_id != null
      && eurlexfil.semantic_sort_id !== ``
    ) {
      eurlexfil.sort = []
    }
  }

  gotToPage(from_doc: number, ndocs: number) {
    this.eurlexFilters.next(new CorpusSearchPayload({ ...this.corpusHistoryService.getLastState(), from_doc, ndocs }))
    this.applyLastFormExecution();
    this.store.dispatch(
      new CorpusSearch(
        new CorpusSearchPayload({ ...this.corpusHistoryService.getLastState(), from_doc, ndocs })
      ));
  }

  private applyLastFormExecution() {
    if (this.corpusHistoryService.eurlexForm_lastExecutionState !== null) {
      this.formMemory.next({
        eurlexForm:
        {
          eurlexMetadataFilters:
            this.corpusHistoryService.eurlexForm_lastExecutionState.eurlexForm.eurlexMetadataFilters ?
              { ...this.corpusHistoryService.eurlexForm_lastExecutionState.eurlexForm.eurlexMetadataFilters }
              :
              undefined,
          eurovocTreeNode: this.corpusHistoryService.eurlexForm_lastExecutionState.eurlexForm.eurovocTreeNode,
          directoryTreeNode: this.corpusHistoryService.eurlexForm_lastExecutionState.eurlexForm.directoryTreeNode
        },
        selectedRepositoryTypes:
          this.corpusHistoryService.eurlexForm_lastExecutionState.selectedRepositoryTypes ?
            [...this.corpusHistoryService.eurlexForm_lastExecutionState.selectedRepositoryTypes]
            :
            undefined
      });
      this.eurovocTreeNode.next([...this.corpusHistoryService.eurlexForm_lastExecutionState?.eurlexForm?.eurovocTreeNode]);
      this.directoryTreeNode.next([...this.corpusHistoryService.eurlexForm_lastExecutionState?.eurlexForm?.directoryTreeNode])
    } else {
      this.formMemory.next(null);
      this.eurovocTreeNode.next([]);
      this.directoryTreeNode.next([])
    }
  }

  sort(sortFields: string[] | undefined) {
    const newPayload = new CorpusSearchPayload({ ...this.corpusHistoryService.getLastState(), sort: sortFields });
    this.eurlexFilters.next(newPayload)
    this.applyLastFormExecution();
    this.store.dispatch(
      new CorpusSearch(
        newPayload
      ));
  }

  sortByDocument(id: string | null) {
    switch (this._mode.getValue()) {
      case Modes.Lazy:
      case Modes.Reactive_unassuming:
      case Modes.Reactive_assuming:
      case Modes.Reactive_hyper_assuming:
        this._semantic_id.next({ id: id, disabled: id !== null ? false : true })
        break;
    }
  }

  countNumberOfEurlexMetadataApplied(change: AdvancedFiltersModel) {
    const eurlexMetadataFilters = change.eurlexForm.eurlexMetadataFilters
    let filterCounter = 0;
    if (eurlexMetadataFilters) {
      const reducer = (accumulator, currentValue) => accumulator || currentValue;
      const nR = eurlexMetadataFilters.selectedResourceTypes && eurlexMetadataFilters.selectedResourceTypes.length > 0 ? 1 : 0;
      const nA = eurlexMetadataFilters.actCategories && eurlexMetadataFilters.actCategories.reduce(reducer) ? 1 : 0;
      const nE = eurlexMetadataFilters.selectedErovocConcepts && eurlexMetadataFilters.selectedErovocConcepts.length > 0 ? 1 : 0;
      const nD = eurlexMetadataFilters.selectedDirectoryConcepts && eurlexMetadataFilters.selectedDirectoryConcepts.length > 0 ? 1 : 0;
      const nI = eurlexMetadataFilters.selectedInfoForce && eurlexMetadataFilters.selectedInfoForce !== `` ? 1 : 0;
      const nDate = (eurlexMetadataFilters.selectedAfterDate || eurlexMetadataFilters.selectedBeforeDate)
        && (eurlexMetadataFilters.selectedAfterDate !== `` || eurlexMetadataFilters.selectedBeforeDate !== ``) ? 1 : 0
      if (nR === 1 || nA === 1) {
        filterCounter = 1 + nI + nE + nD + nDate;
      } else {
        filterCounter = nI + nE + nD + nDate;
      }
      this.filterCounter.next(filterCounter);
    }
  }

  isQueryDifferent(lastState: CorpusSearchPayload, corpusSearchPayload: CorpusSearchPayload) {
    let result = true
    result = result && (corpusSearchPayload.getSelectedTerms(lastState.termCorpus) !== corpusSearchPayload.getSelectedTerms(corpusSearchPayload.termCorpus))
    if (
      (lastState.eurovoc_mth === undefined || lastState.eurovoc_mth === null)
      &&
      (corpusSearchPayload.eurovoc_mth === undefined || corpusSearchPayload.eurovoc_mth === null)
    ) {
      result = result && true
    } else {
      result = result && (lastState.eurovoc_mth.length !== corpusSearchPayload.eurovoc_mth.length)
      if (result) {
        for (const currentValue of lastState.eurovoc_mth) {
          if (!result) {
            break
          }
          result = result && corpusSearchPayload.eurovoc_mth.every((value) => value !== currentValue);
        }
      }
    }


    result = result && (lastState.info_force !== corpusSearchPayload.info_force)

    if (
      (lastState.res_type === undefined || lastState.res_type === null)
      &&
      (corpusSearchPayload.res_type === undefined || corpusSearchPayload.res_type === null)
    ) {
      return result
    } else {
      result = result && (lastState.res_type.size !== corpusSearchPayload.res_type.size)
      if (result) {
        for (const currentValue of lastState.res_type) {
          if (!result) {
            break
          }
          result = result && [...corpusSearchPayload.res_type].every((value) => value !== currentValue);
        }
      }
    }


    if (
      (lastState.sector === undefined || lastState.sector === null)
      &&
      (corpusSearchPayload.sector === undefined || corpusSearchPayload.sector === null)
    ) {
      return result
    } else {
      result = result && (lastState.sector.size !== corpusSearchPayload.sector.size)
      if (result) {
        for (const currentValue of lastState.sector) {
          if (!result) {
            break
          }
          result = result && [...corpusSearchPayload.sector].every((value) => value !== currentValue);
        }
      }
    }

    return result
  }


  assert(value: boolean) {
    value && value != null && value === true ? true : false
  }
  ngOnInit(): void { }

  public loadPastCorpusQueries(): Observable<TreeNode[]> {
    var subject = new Subject<TreeNode[]>();
    this.rest.getQueries(this.currentUser.username).subscribe(
      (response: any) => {
          console.log(response);
          let qms: TreeNode[] 
          if (response?.status === 'OK' && response?.state?.value) {
            qms = JSON.parse(response.state.value);
          } else {
            qms = []
          }
          
          subject.next((qms))
      })
    return subject.asObservable();
  }


  public loadQueryByName(name: string): Observable<QueryModel> {
    var subject = new Subject<QueryModel>();
    this.rest.getState(this.currentUser.username, name).subscribe((r: any) => {
      let qm = JSON.parse(r.state.value);
      subject.next(new QueryModel(
        {
          ...qm,
          payload:
          {
            ...qm.payload,
            sector: qm.payload.sector ?
              new Set([...qm.payload.sector]) :
              new Set([]),
            res_type: qm.payload.res_type ?
              new Set([...qm.payload.res_type])
              :
              new Set([])
          }
        }))
    })
    return subject.asObservable();
  }

  executeSavedQuery(savedQuery: QueryModel) {
    // res_type and sector are Set types and have to reconstructed from serialized string[]
    this.eurlexFilters.next(new CorpusSearchPayload(
      {
        ...savedQuery.payload,
        sector: savedQuery.payload.sector ?
          new Set([...savedQuery.payload.sector]) :
          new Set([]),
        res_type: savedQuery.payload.res_type ?
          new Set([...savedQuery.payload.res_type])
          :
          new Set([])
      }))
    if (savedQuery.filters !== null) {
      this.formMemory.next(new AdvancedFiltersModel({ ...savedQuery.filters }))
      if (savedQuery.filters?.eurlexForm?.eurovocTreeNode) {
        this.eurovocTreeNode.next(savedQuery.filters.eurlexForm.eurovocTreeNode)
      } else {
        this.eurovocTreeNode.next([])
      }
      if (savedQuery.filters?.eurlexForm?.directoryTreeNode) {
        this.directoryTreeNode.next(savedQuery.filters.eurlexForm.directoryTreeNode)
      } else {
        this.directoryTreeNode.next([])
      }
    } else {
      this.formMemory.next(null)
      this.eurovocTreeNode.next([])
      this.directoryTreeNode.next([])
    }
    this.search()
  }


  saveQuery(nodes: TreeNode[]) {
    let newPayload = new CorpusSearchPayload({ ...this.corpusHistoryService.getLastState() });
    this.eurlexFilters.next(newPayload)
    this.rest
      .setState(
        this.currentUser.username,
        'corpus-payload',
        JSON.stringify(nodes.map((node) => {
          return this.setParentNodesToNull(node)
        }))
      )
      .subscribe((r) => {
      });
  }


  /**
   * setParentNodesToNull
   * Necessary in order to avoid error: 
   * 'Converting circular structure to JSON' when doing JSON.stringify
   */
  public setParentNodesToNull(node: TreeNode) {
    node.parent = null
    if (node.children && node.children.length !== 0) {
      node.children.forEach((child) => {
        child.parent = null
        if (!child.leaf) {
          this.setParentNodesToNull(child)
        }
      })
    }
    return node
  }


  deleteStateByName(key: string): Observable<boolean> {
    var subject = new BehaviorSubject<boolean>(true);
    this.rest.deleteState(this.currentUser.username, key).subscribe((r) => {
    });
    return subject.asObservable()
  }
}
