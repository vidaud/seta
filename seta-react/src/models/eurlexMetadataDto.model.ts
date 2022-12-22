// import { TreeNode } from 'primeng/api';
import { EurovocThesaurusModel } from './eurovoc-thesaurus.model';
import { Resource } from './resource.model';

export class ResourceTypeDto extends Resource {
  public code: string;
  public label: string;
  public definition: string;

  constructor(data?: Partial<ResourceTypeDto>) {
    super();
    Object.assign(this, data);
  }
}

export class DocumentSector extends Resource {
  public sectorCode: string;
  public sectorLabel: string;
  public typeCode: string;
  public typeLabel: string;

  constructor(data?: Partial<DocumentSector>) {
    super();
    Object.assign(this, data);
  }
}

export class SubjectType extends Resource {
  public code: string;
  public label: string;

  constructor(data?: Partial<SubjectType>) {
    super();
    Object.assign(this, data);
  }
}


export class DocumentSectorAndType {
  public sectorCode: string;
  public sectorLabel: string;
  public typeCode: string;
  public typeLabel: string;

  constructor(data?: Partial<DocumentSectorAndType>) {
    Object.assign(this, data);
  }
}

export class Filter {
  public filterName: string;
  public filterValues: string[];

  constructor(data?: Partial<Filter>) {
    Object.assign(this, data);
  }
}

export class ActCategoryDto {
  public resourceSector: string;
  public resourceSectorInfo: string;
  public filters: Filter[];

  constructor(data?: Partial<ActCategoryDto>) {
    Object.assign(this, data);
  }
}

// export class MetadataTreeNode implements TreeNode<any> {
//   label?: string;
//   data?: any;
//   icon?: string;
//   expandedIcon?: any;
//   collapsedIcon?: any;
//   children?: TreeNode<any>[];
//   leaf?: boolean;
//   expanded?: boolean;
//   type?: string;
//   parent?: TreeNode<any>;
//   partialSelected?: boolean;
//   styleClass?: string;
//   draggable?: boolean;
//   droppable?: boolean;
//   selectable?: boolean;
//   key?: string;
  
//   constructor(data?: Partial<MetadataTreeNode>) {
//     Object.assign(this, data);
//   }
// }



// export class DirectoryConceptsDto {
//   public conc_dir_1: string;
//   public conc_dir_2: string;
//   public conc_dir_3: string;
  
//   constructor(data?: Partial<DirectoryConceptsDto>) {
//     Object.assign(this, data);
//   }
// }

export class EurovocMthMapDto {
  [index: string]: string;

  constructor(data?: Partial<EurovocMthMapDto>) {
    Object.assign(this, data);
  }
}

export class TreeRoot { 
//   data: TreeDatum[];

  constructor(data?: Partial<TreeRoot>) {
    Object.assign(this, data);
  }
}


export class TreeDatum extends Resource {
  public label?: string;
  public data?: any;
  public icon?: string;
  public expandedIcon?: any;
  public collapsedIcon?: any;
//   public children?: TreeNode<any>[];
  public leaf?: boolean;
  public expanded?: boolean;
  public type?: string;
//   public parent?: TreeNode<any>;
  public partialSelected?: boolean;
  public styleClass?: string;
  public draggable?: boolean;
  public droppable?: boolean;
  public selectable?: boolean;
  public key?: string;
  public notation?: string;
  public domain_mts?: string[];
  public uuid?: string;
  
  constructor(data?: Partial<TreeDatum>) {
    super()
    Object.assign(this, data);
  }
}


export class EurlexMetadataDto extends Resource {

  public actCategories: ActCategoryDto[];
  public resourceTypeDtos: ResourceTypeDto[];
  public documentSectors: DocumentSector[];
  public subjectTypes: SubjectType[];
  public eurovocThesaurusConcepts: EurovocThesaurusModel[]
  public eurovocMthMapDto: EurovocMthMapDto = {};
  public eurovocDomMapDto: EurovocMthMapDto = {};
//   public eurovocTree: TreeNode[] = null;
  //public directoryTree: TreeNode[] = null;
  public selectedBeforeDate: string;
  public selectedAfterDate: string;

  constructor(data?: Partial<EurlexMetadataDto>) {
    super();
    Object.assign(this, data);
  }

}