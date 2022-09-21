import { TreeNode } from "primeng/api";
import { EurovocThesaurusModel } from "./eurovoc-thesaurus.model";
import { Resource } from "./resource.model";

export class EurlexFormModel extends Resource {
  eurlexMetadataFilters: {
    actCategories: boolean[]
    selectedErovocConcepts: EurovocThesaurusModel[]
    selectedInfoForce: string
    selectedResourceTypes: string[],
    selectedDirectoryConcepts: string[],
    selectedBeforeDate: string,
    selectedAfterDate: string,
  }
  eurovocTreeNode: string[]
  directoryTreeNode: string[]

  constructor(data?: Partial<EurlexFormModel>) {
    super();
    Object.assign(this, data);
  }
}