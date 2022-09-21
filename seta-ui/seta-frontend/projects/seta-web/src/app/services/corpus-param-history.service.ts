import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdvancedFiltersModel } from '../models/advanced-filters.model';
import { EurovocThesaurusModel } from '../models/eurovoc-thesaurus.model';
import { CorpusSearchPayload } from '../store/corpus-search-payload';
import { SetaStateCorpus } from '../store/seta-corpus.state';


export class EurlexFormLastExecutionState {
  eurlexMetadataFilters: {
    actCategories: boolean[]
    selectedErovocConcepts: EurovocThesaurusModel[]
    selectedInfoForce: string
    selectedResourceTypes: string[]
    selectedDirectoryConcepts: string[]
    selectedBeforeDate: string
    selectedAfterDate: string
  }
  eurovocTreeNode: TreeNode[]

  constructor(data?: Partial<EurlexFormLastExecutionState>) {
    Object.assign(this, data);
  }
}

export class AdvancedFiltersFormLastExecutionState {
  eurlexLastState: EurlexFormLastExecutionState;
  selectedRepositoryTypes: string[];

  constructor(data?: Partial<AdvancedFiltersFormLastExecutionState>) {
    Object.assign(this, data);
  }
}

@Injectable({
  providedIn: `root`
})
export class CorpusParamHistoryService {

  @Select(SetaStateCorpus.corpusSearchPayload)
  public corpusSearchPayload$: Observable<CorpusSearchPayload>;

  private _history: CorpusSearchPayload[] = [];

  private _history_sub = new BehaviorSubject<CorpusSearchPayload[]>([]);

  private _history_sub$ = this._history_sub.asObservable();

  public set history_sub(value) {
    this._history_sub.next(value);
  }

  public get history_sub$() {
    return this._history_sub$;
  }

  public eurlexForm_lastExecutionState: AdvancedFiltersModel = null

  getLastState(): CorpusSearchPayload {
    return this._history.find(x=>x!==undefined);
  }

  /**
   * findQueryNotNull
   */
  public findQueryNotNull(): CorpusSearchPayload {
    return this._history.find((state): CorpusSearchPayload => {
      if (state.termCorpus && state.termCorpus.length !== 0) {
        return state;
      }
    });
  }

  public areStatesEquals(first: number, second: number): boolean {
    const firstState = this._history[first];
    const secondState = this._history[second];
    return this.arePayloadsEqual(firstState, secondState)
  }

  public arePayloadsEqual(firstState: CorpusSearchPayload, secondState: CorpusSearchPayload): boolean {
    let result = true;
    if (firstState && secondState) {
      result = (firstState.getSelectedTerms(firstState.termCorpus) === secondState.getSelectedTerms(secondState.termCorpus))
      /* if (firstState.termCorpus.length !== secondState.termCorpus.length) {
        result = false;
      } else {
        for (let index = 0; index < firstState.termCorpus.length; index++) {
          const fs = firstState.termCorpus[index];
          const ss = secondState.termCorpus[index];
          if (fs.isOperator !== ss.isOperator) {
            result = false;
            break;
          } else {
            if (fs.isOperator) {
              if (fs.operator.code !== ss.operator.code) {
                result = false;
                break;
              }
            } else {
              if (fs.value !== ss.value) {
                result = false;
                break;
              }
            }
          }
        }
      } */
      if (firstState.info_force !== secondState.info_force) {
        result = false;
      }
      if (firstState.semantic_sort_id !== secondState.semantic_sort_id) {
        result = false;
      }
      if (result !== false) {
        for (const key of [
          `source`,
          `sector`,
          `subject`,
          `res_type`,
          `eurovoc_dom`,
          `eurovoc_mth`,
          `eurovoc_tt`,
          `eurovoc_concept`,
          `conc_dir_1`,
          `conc_dir_2`,
          `conc_dir_3`]) {
          result = this.checkStringList(firstState, secondState, key);
          if (!result) {
            break;
          }
        }
      }
    }

    return result;
  }

  public checkStringList(firstState: CorpusSearchPayload, secondState: CorpusSearchPayload, key: string): boolean {
    let result = true;
    if (firstState[key] && secondState[key]) {
      if (firstState[key].length !== secondState[key].length) {
        result = false;
      } else {
        for (const ss of secondState[key]) {
          if ([...firstState[key]].indexOf(ss) === -1) {
            result = false;
            break;
          }
        }
      }
    }
    return result;
  }

  constructor() {
    this.corpusSearchPayload$.subscribe((corpusSearchPayload: CorpusSearchPayload) => {
      if (corpusSearchPayload.termCorpus.length > 0 || corpusSearchPayload.semantic_sort_id) {
        this._history = [corpusSearchPayload, ...this._history];
        this.history_sub = this._history
      }
    });
  }
}
