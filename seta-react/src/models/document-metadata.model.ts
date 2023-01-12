import { CelexLink, ConcordancePermutation, DomainsModel } from './document.model';
import { Resource } from './resource.model';

export class SetaDocumentMetadata extends Resource {
  public _id: string;
  public id: string;
  public id_alias: string;
  public source: string;
  public score: number | string;
  public title: string[];
  public abstract: string;
  // public collection?: string;
  // public reference?: string;
  public author: string[];
  public date: string[];
  public link_origin: string[];
  public link_alias: string[];
  public link_related: string[];
  public link_reference: string[];
  public mimeType: string;
  public in_force: string;
  public language: string;
  public keywords: string;
  public other: string;
  // public chunk_number: number | string;
  // public sbert_embedding: string[];
  public document_id: string;
  public chunk_text: string;
  // public concordance: ConcordancePermutation;
  constructor(data?: Partial<SetaDocumentMetadata>) {
    super();
    Object.assign(this, data);
  }
}