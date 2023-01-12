import { SetaDocumentMetadata } from '../models/document-metadata.model';
import { CelexLink, DomainsModel } from '../models/document.model';
import { Serializer } from './serializer.interface';

export class SetaDocumentMetadataSerializer implements Serializer {
  private celex_links_types = [`PDF`, `HTML`, `ALL`]
  public fromJson(json: any): SetaDocumentMetadata {
    const doc = new SetaDocumentMetadata();
    doc._id = json._id;
    doc.id = json.id;
    doc.id_alias = json.id_alias;
    doc.source = json.source;
    doc.score = json.score;
    doc.title = Array.isArray(json.title) ? [...json.title] : json.title;
    doc.abstract = json.abstract;
    doc.link_origin = [...json.link_origin];
    doc.link_alias = [...json.link_alias];
    doc.link_reference = [...json.link_reference];
    doc.link_related = [...json.link_related];

    // if (json.collection) {
    //   doc.collection = json.collection;
    // }
    // if (json.reference) {
    //   doc.reference = json.reference;
    // }
    doc.author = [...json.author];
    doc.date = Array.isArray(json.date) && json.date.length > 0 ? json.date[0] : null || (json.date)?.constructor === String ? json.date : null;
    if (json.reference) {
      doc.mimeType = json.mime_type;
    }
    if (json.language) {
      doc.language = json.language;
    }
    if (json.keywords) {
      doc.keywords = json.keywords;
    }
    if (json.other) {
      doc.other = json.other;
    }
    doc.document_id = json.document_id;
    doc.chunk_text = json.chunk_text;
    return doc;
  }
  toJson(resource: SetaDocumentMetadata) {
    throw new Error(`Method not implemented.`);
  }

  returnCorrectCelexLinkType(data: string): string {
    let retunType = ``
    for (const type of this.celex_links_types) {
      if (data.includes(type)) {
        retunType = type
      }
    }
    return retunType
  }
}