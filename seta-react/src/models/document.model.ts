import { EmbeddingsModel } from './embeddings.model';
import { Resource } from './resource.model';

export class SetaDocument extends Resource {
  public _id: string;
  public id: string;
  public id_alias: string;
  public document_id: string;
  public title: string;
  public abstract: string;
  public chunk_text: string;
  // public celex_links?: CelexLink[];
  public date: string[];
  public source: string;
  public score: number;
  public language: string;
  public in_force?: string;
  public idCollection?: string;
  public reference?: ResourceType[];
  public author: string;
  public eurovoc_dom?: DomainsModel;
  public eurovoc_mth?: DomainsModel;
  public ec_priority?: DomainsModel;
  public sdg_domain?: DomainsModel;
  public sdg_subdomain?: DomainsModel;
  public euro_sci_voc?: DomainsModel;
  public keywords?: string;
  public other?: string;
  public highlight?: SetaHighLight;
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

export class DomainsModel extends Resource {
  public classifier: string;
  public label: string;
  public validated: string;
  public version: string;

  constructor(data?: Partial<DomainsModel>) {
    super();
    Object.assign(this, data);
  }
}