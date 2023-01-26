import { Resource } from '../models/resource.model';
import { Operators, Term, TermType } from '../models/term.model';

export class CorpusSearchPayload extends Resource {

  public id?: number | string;
  public _id?: number | string;
  public term: Term[];
  public n_docs?: number;
  public from_doc?: number;
  public search_type?: string;
  public source?: string[];
  public reference?: Set<string>;
  public collection?: Set<string>;
  public eurovoc_dom?: string[];
  public eurovoc_mth?: string[];
  public eurovoc_tt?: string[];
  public ec_priority?: string[];
  public eurovoc_concept?: string[];
  public sdg_domain?: string[];
  public sdg_subdomain?: string[];
  public euro_sci_voc?: string[];
  public in_force?: boolean;
  public sort?: string[];
  public semantic_sort_id?: string;
  public vector?: number[];
  public author?: string;
  public date_range?: string[];
  public aggs?: string;

  prepareCorpusParams() {
    let httpParams: any = new URLSearchParams();
    if (this.term && this.term.length > 0) {
      httpParams = httpParams.set(`term`, this.getSelectedTerms(this.term));
    }
    if (this.n_docs) {
      httpParams = httpParams.set(`n_docs`, this.n_docs.toString());
    }
    if (this.from_doc && this.from_doc != null) {
      httpParams = httpParams.set(`from_doc`, this.from_doc.toString());
    }
    if (this.search_type && this.search_type !== ``) {
      httpParams = httpParams.set(`search_type`, this.search_type);
    }
    if (this.source && this.source.length > 0) {
      httpParams = httpParams.set(`source`, this.source.join(`,`));
    }
    if (this.reference && this.reference.size > 0) {
      httpParams = httpParams.set(`reference`, [...this.reference].join(`,`));
    }
    if (this.collection && this.collection.size > 0) {
      httpParams = httpParams.set(`collection`, [...this.collection].join(`,`));
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
    if (this.ec_priority && this.ec_priority.length > 0) {
      httpParams = httpParams.set(`ec_priority`, this.ec_priority.join(`,`));
    }
    if (this.sdg_domain && this.sdg_domain.length > 0) {
      httpParams = httpParams.set(`sdg_domain`, this.sdg_domain.join(`,`));
    }
    if (this.sdg_subdomain && this.sdg_subdomain.length > 0) {
      httpParams = httpParams.set(`sdg_subdomain`, this.sdg_subdomain.join(`,`));
    }
    if (this.euro_sci_voc && this.euro_sci_voc.length > 0) {
      httpParams = httpParams.set(`euro_sci_voc`, this.euro_sci_voc.join(`,`));
    }
    if (this.in_force !== undefined && this.in_force !== null) {
      httpParams = httpParams.set(`in_force`, this.in_force.toString());
    }
    if (this.sort && this.sort.length > 0) {
      httpParams = httpParams.set(`sort`, this.sort.join(`,`));
    }
    if (this.semantic_sort_id && this.semantic_sort_id !== ``) {
      httpParams = httpParams.set(`semantic_sort_id`, this.semantic_sort_id);
    }
    if (this.vector && this.vector.length > 0) {
      httpParams = httpParams.set(`sbert_embedding`, this.vector.map((vec) => vec.toString()).join(`,`));
    }
    if (this.author && this.author !== ``) {
      httpParams = httpParams.set(`author`, this.author);
    }
    if (this.date_range && this.date_range.length > 0) {
      httpParams = httpParams.set(`date_range`, this.date_range.join(`,`));
    }
    if (this.aggs && this.aggs !== ``) {
      httpParams = httpParams.set(`aggs`, this.aggs);
    }
    return httpParams;
  }

  public getSelectedTerms(suggestions: Term[]): string {
    let suggestionsCopy: any = [...suggestions]
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