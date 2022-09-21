import { CelexLink, ConcordancePermutation, ResourceType, SetaDocument, SetaElement, StyleEntities } from '../models/document.model';
import { EmbeddingsModel } from '../models/embeddings.model';
import { Resource } from '../models/resource.model';
import { Serializer } from './serializer.interface';

export class SetaDocumentSerializer implements Serializer {

  public fromJson(json: any): SetaDocument {
    const doc = new SetaDocument();
    doc.id = json.id;
    doc.score = json.score;
    doc.source = json.id.includes(`CELEX`) ? `eurlex` : json.source;
    doc.date = json.date;
    doc.title = json.title;
    // doc.isDocInModel = json.is_doc_in_model;
    if (json.celex_links) {
      doc.celex_links = [...json.celex_links].map((data) => new CelexLink({ link: data.link, type: data.type }));
    }
    if (json.doc_type) {
      doc.docType = json.doc_type;
    }
    if (json.info_force) {
      doc.infoForce = json.info_force;
    }
    if (json.date_year) {
      doc.dateYear = json.date_year;
    }
    if (json.id_sector) {
      doc.idSector = json.id_sector;
    }
    if (json.list_ressource_type) {
      doc.listResourceType = [...[...json.list_ressource_type]].map(
        (data) => new ResourceType({ code: data[0], label: data[1] }),
      );
    }
    if (json.eurovoc_dom) {
      doc.eurovocDom = [...[...json.eurovoc_dom]].map(
        (data) => new ResourceType({ code: data[1], label: data[0] }),
      );
    }
    if (json.eurovoc_mth) {
      doc.eurovocMth = [...[...json.eurovoc_mth]].map(
        (data) => new ResourceType({ code: data[1], label: data[0] }),
      );
    }
    if (json.concordance) {
      doc.concordance = [...json.concordance].map((data) => { return new ConcordancePermutation({ contextLx: data[0], keyword: data[1], contextRx: data[2] }) })
    }
    if (json.embeddings) {
      doc.embeddings = new EmbeddingsModel({ vector: [...json.embeddings.vector], version: json.embeddings.version })
    }
    return doc;

  }

  toJson(resource: Resource) {
    throw new Error(`Method not implemented.`);
  }

}
