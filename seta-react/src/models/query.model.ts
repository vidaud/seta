import { CorpusSearchPayload } from "../store/corpus-search-payload";
import { AdvancedFiltersModel } from "./advanced-filters.model";
import { Resource } from "./resource.model";

export class QueryModel extends Resource {
  
  public payload?: CorpusSearchPayload;
  public filters?: AdvancedFiltersModel;

  constructor(data?: Partial<QueryModel>) {
    super();
    Object.assign(this, data);
  }
}