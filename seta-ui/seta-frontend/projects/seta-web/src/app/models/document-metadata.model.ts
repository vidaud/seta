import { CelexLink } from './document.model';
import { Resource } from './resource.model';

export class SetaDocumentMetadata extends Resource {
  public title: string[];
  public ia: string;
  public links: string[];
  public source: string;
  public agent: string[];
  public timestamp: Date;
  // public isDocInModel: boolean; /* to be removed */
  public celex_links?: CelexLink[];
  public date: string[];
  public step: string;
  public version: string;
  public text: string;
  public scope: string;
  public longid: string;
  public subject: string[];
  public abstract: string;
  public formatUsed: string; /* to be removed */
  public id: string;
  constructor(data?: Partial<SetaDocumentMetadata>) {
    super();
    Object.assign(this, data);
  }
}
