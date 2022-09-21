import { HttpParams } from '@angular/common/http';
import { Resource } from '../models/resource.model';
import { Operators, Term, TermType } from '../models/term.model';

export class CorpusSearchPayload extends Resource {

  public id?: number | string;
  public termCorpus: Term[];
  public source?: string[];
  public ndocs?: number;
  public from_doc?: number;
  public sector?: Set<string>;
  public subject?: string[];
  public res_type?: Set<string>;
  public eurovoc_dom?: string[];
  public eurovoc_mth?: string[];
  public eurovoc_tt?: string[];
  public eurovoc_concept?: string[];
  public conc_dir_1?: string[];
  public conc_dir_2?: string[];
  public conc_dir_3?: string[];
  public info_force?: boolean;
  public sort?: string[];
  public semantic_sort_id?: string;
  public vector?: number[];
  public date_range?: string[];

  prepareCorpusParams(): HttpParams {
    let httpParams = new HttpParams();
    if (this.termCorpus && this.termCorpus.length > 0) {
      httpParams = httpParams.set(`term`, this.getSelectedTerms(this.termCorpus));
    }
    if (this.source && this.source.length > 0) {
      httpParams = httpParams.set(`source`, this.source.join(`,`));
    }
    if (this.ndocs) {
      httpParams = httpParams.set(`n_docs`, this.ndocs.toString());
    }
    if (this.from_doc && this.from_doc != null) {
      httpParams = httpParams.set(`from_doc`, this.from_doc.toString());
    }
    if (this.sector && this.sector.size > 0) {
      httpParams = httpParams.set(`sector`, [...this.sector].join(`,`));
    }
    if (this.subject && this.subject.length > 0) {
      httpParams = httpParams.set(`subject`, this.subject.join(`,`));
    }
    if (this.res_type && this.res_type.size > 0) {
      httpParams = httpParams.set(`res_type`, [...this.res_type].join(`,`));
    }
    if (this.eurovoc_dom && this.eurovoc_dom.length > 0) {
      httpParams = httpParams.set(`eurovoc_dom`, this.eurovoc_dom.join(`,`));
    }
    if (this.eurovoc_mth && this.eurovoc_mth.length > 0) {
      httpParams = httpParams.set(`eurovoc_mth`, this.eurovoc_mth.join(`,`));
    }
    if (this.eurovoc_tt && this.eurovoc_tt.length > 0) {
      httpParams = httpParams.set(`eurovoc_tt`, this.eurovoc_tt.join(`,`));
    }
    if (this.eurovoc_concept && this.eurovoc_concept.length > 0) {
      httpParams = httpParams.set(`eurovoc_concept`, this.eurovoc_concept.join(`,`));
    }
    if (this.conc_dir_1 && this.conc_dir_1.length > 0) {
      httpParams = httpParams.set(`conc_dir_1`, this.conc_dir_1.join(`,`));
    }
    if (this.conc_dir_2 && this.conc_dir_2.length > 0) {
      httpParams = httpParams.set(`conc_dir_2`, this.conc_dir_2.join(`,`));
    }
    if (this.conc_dir_3 && this.conc_dir_3.length > 0) {
      httpParams = httpParams.set(`conc_dir_3`, this.conc_dir_3.join(`,`));
    }
    if (this.info_force !== undefined && this.info_force !== null) {
      httpParams = httpParams.set(`info_force`, this.info_force.toString());
    }
    if (this.sort && this.sort.length > 0) {
      httpParams = httpParams.set(`sort`, this.sort.join(`,`));
    }
    if (this.semantic_sort_id && this.semantic_sort_id !== ``) {
      httpParams = httpParams.set(`semantic_sort_id`, this.semantic_sort_id);
    }
    if (this.vector && this.vector.length > 0) {
      httpParams = httpParams.set(`emb_vector`, this.vector.map((vec) => vec.toString()).join(`,`));
    }
    if (this.date_range && this.date_range.length > 0) {
      httpParams = httpParams.set(`date_range`, this.date_range.join(`,`));
    }
    return httpParams;
  }

  public getSelectedTerms(suggestions: Term[]): string {
    let suggestionsCopy = [...suggestions]
    suggestionsCopy = suggestionsCopy.filter((sugg) => { return sugg.termType !== TermType.DOCUMENT})
    let suggestionString = ``;
    let finalSuggestionString = ``;
    for (let index = 0; index < suggestionsCopy.length; index++) {
      const suggestion = suggestionsCopy[index];
      if (index < suggestionsCopy.length - 1) {
        if (suggestion.isOperator) {
          continue;
        } else {
          if (suggestion.display === `AND` || suggestion.display === `OR`) {
            continue;
          } else {
            if (
              (suggestionsCopy[index + 1].isOperator && suggestionsCopy[index + 1].operator.index === Operators.AND)
              ||
              (suggestionsCopy[index + 1].display === `AND`)
            ) {
              suggestionString += suggestion.display.replace('\\\"', '"') + Operators.properties[Operators.AND].code;
            } else {
              suggestionString += suggestion.display.replace('\\\"', '"') + Operators.properties[Operators.OR].code;
            }
          }
        }
      } else {
        suggestionString += suggestion.display.replace('\\\"', '');
      }
    }

    const suggestionList = suggestionString.split(` AND `)
    if (suggestionList.length > 0) {
      finalSuggestionString = suggestionList.reduce((total, currentValue, currentIndex, arr) => {
        if (currentIndex === 1) {
          return `(${total})` + ` AND ` + `(${currentValue})`;
        } else {
          return total + ` AND ` + `(${currentValue})`;
        }
      })
    } else {
      finalSuggestionString = suggestionString
    }

    return finalSuggestionString;
  }

  constructor(data?: Partial<CorpusSearchPayload>) {
    super();
    Object.assign(this, data);
  }
}

export class CorpusSearchPayloadWrapper {
  public name?: string;
  public payload?: CorpusSearchPayload;

  constructor(data?: Partial<CorpusSearchPayloadWrapper>) {
    Object.assign(this, data);
  }



}