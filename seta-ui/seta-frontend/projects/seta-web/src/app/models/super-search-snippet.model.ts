import { Resource } from './resource.model';

export class SuperSearchSnippet extends Resource {
  documentId: string;
  rowId: string;
  text: string;

  constructor(data?: Partial<SuperSearchSnippet>) {
    super();
    Object.assign(this, data);
  }
}