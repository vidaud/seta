import { EurlexFormModel } from "./eurlex-form.model";
import { Resource } from "./resource.model";

export class AdvancedFiltersModel extends Resource {
  
  selectedRepositoryTypes: string[] | undefined;
  eurlexForm: EurlexFormModel;

  constructor(data?: Partial<AdvancedFiltersModel>) {
    super();
    Object.assign(this, data);
  }
}