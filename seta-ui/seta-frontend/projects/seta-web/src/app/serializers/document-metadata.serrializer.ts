import { SetaDocumentMetadata } from '../models/document-metadata.model';
import { CelexLink } from '../models/document.model';
import { Serializer } from './serializer.interface';

export class SetaDocumentMetadataSerializer implements Serializer {
  private celex_links_types = [`PDF`, `HTML`, `ALL`]
  public fromJson(json: any): SetaDocumentMetadata {
    const doc = new SetaDocumentMetadata();
    doc.title = Array.isArray(json.title) ? [...json.title] : json.title;
    doc.ia = json.ia;
    doc.links = [...json.links];
    doc.source = json.source;
    doc.agent = [...json.agent];
    doc.timestamp = json.timestamp;
    // doc.isDocInModel = json.is_doc_in_model;
    if (json.celex_links) {
      doc.celex_links =
        [...json.celex_links].map((data) => new CelexLink(
          {
            link: data, 
            type: this.returnCorrectCelexLinkType(data)
          }
        ));
    }
    doc.date = [...json.date];
    doc.step = json.step;
    doc.version = json.version;
    doc.text = json.text;
    doc.scope = json.scope;
    doc.longid = json.longid;
    doc.subject = [...json.subject];
    doc.abstract = json.abstract;
    doc.formatUsed = json.format_used;
    doc.id = json.id;
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
