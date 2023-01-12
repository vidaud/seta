import { SetaDocument } from './document.model';
import { Resource } from './resource.model';

export class SetaCorpus extends Resource {
  public documents: SetaDocument[];
  public total_docs: number;
}