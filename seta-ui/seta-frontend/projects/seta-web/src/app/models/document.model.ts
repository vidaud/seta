import { EmbeddingsModel } from './embeddings.model';
import { Resource } from './resource.model';

export class SetaDocument extends Resource {
  public id: string;
  public title: string;
  public score: number;
  public source: string;
  public date: string;
  public isDocInModel: boolean;
  public highlight?: SetaHighLight;
  public celex_links?: CelexLink[];
  public infoForce?: string;
  public dateYear?: string;
  public idSector?: string;
  public docType?: string[];
  public listResourceType?: ResourceType[];
  public eurovocDom?: ResourceType[];
  public eurovocMth?: ResourceType[];
  public subjectMatter?: SubjectType[];
  public concordance?: ConcordancePermutation[];
  public embeddings?: EmbeddingsModel;
  
  constructor(data?: Partial<SetaDocument>) {
    super();
    Object.assign(this, data);
  }
}

export class SetaHighLight extends Resource {
  public title: SetaElement[][];
  public text: SetaElement[][];
  
  constructor(data: Partial<SetaHighLight>) {
    super();
    Object.assign(this, data)
  }
}

export class SetaElement extends Resource {

  value?: string
  type?: string
  pos?: string
  charpos?: string
  wordlen?: string
  replacer?: Replacer

  constructor(data: Partial<SetaElement>) {
    super();
    Object.assign(this, data)
  }

}

export interface Replacer {
  type: string
  subtype: string | null
  style: StyleEntities
}

export enum StyleEntities {
  OTHER = 'other',
  ORGANISATION = 'organisation',
  GEO = 'geo',
  PERSON = 'person',
  NUMBER = 'number',
  PRODUCT = 'product',
  LOCATION = 'location',
  TAN = 'tan',
  EVENT = 'event',
  COBALT = 'cobalt',
  IDENTITY = 'identity',
  SLATE = 'slate',
  TIME = 'time',
  YELLOW = 'yellow'
}

export class CelexLink extends Resource {
  public link: string;
  public type: string;

  constructor(data?: Partial<CelexLink>) {
    super();
    Object.assign(this, data);
  }
}

export class HighLight extends Resource {
  public title: string[];
  public text: string[];

  constructor(data?: Partial<HighLight>) {
    super();
    Object.assign(this, data);
  }
}


export class DocType extends Resource {
  public label: string;
  public code: string;
}

export class ResourceType extends Resource {
  public code: string;
  public label: string;

  constructor(data?: Partial<ResourceType>) {
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

export class ConcordancePermutation extends Resource {
  public contextLx: string;
  public keyword: string;
  public contextRx: string;

  constructor(data?: Partial<ConcordancePermutation>) {
    super();
    Object.assign(this, data);
  }
}
