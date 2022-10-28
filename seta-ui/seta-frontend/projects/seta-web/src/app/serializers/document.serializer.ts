import { CelexLink, ConcordancePermutation, DomainsModel, ResourceType, SetaDocument, SetaElement, StyleEntities } from '../models/document.model';
import { EmbeddingsModel } from '../models/embeddings.model';
import { Resource } from '../models/resource.model';
import { Serializer } from './serializer.interface';

export class SetaDocumentSerializer implements Serializer {

  public fromJson(json: any): SetaDocument {
    const doc = new SetaDocument();
    doc._id = json._id;
    doc.id = json.id;
    doc.id_alias = json.id_alias;
    doc.document_id = json.document_id;
    doc.title = json.title;
    doc.abstract = json.abstract;
    doc.chunk_text = json.chunk_text;
    //doc.date = json.date;
    doc.date = Array.isArray(json.date) && json.date.length > 0 ? json.date[0] : null || (json.date)?.constructor === String ? json.date : null;
    doc.source = json.id.includes(`CELEX`) ? `eurlex` : json.source;
    doc.score = json.score;
    // doc.isDocInModel = json.is_doc_in_model;
    // if (json.celex_links) {
    //   doc.celex_links = [...json.celex_links].map((data) => new CelexLink({ link: data.link, type: data.type }));
    // }
    if (json.language) {
      doc.language = json.language;
    }
    if (json.in_force) {
      doc.in_force = json.in_force;
    }
    if (json.collection) {
      doc.idCollection = json.collection;
    }
    // if (json.reference) {
    //   doc.reference = json.reference;
    // }
    doc.author = json.author;
    //doc.author = [...json.author];
    if (json.reference) {
      doc.reference = [...[...json.reference]].map(
        (data) => new ResourceType({ code: data[0], label: data[1] }),
      );
    }
    if (json.eurovoc_dom) {
      doc.eurovoc_dom = json.eurovoc_dom;
    }
    if (json.eurovoc_mth) {
      doc.eurovoc_mth = json.eurovoc_mth;
    }
    if (json.ec_priority) {
      doc.ec_priority = json.ec_priority;
    }
    if (json.sdg_domain) {
      doc.sdg_domain = json.sdg_domain;
    }
    if (json.sdg_subdomain) {
      doc.sdg_subdomain = json.sdg_subdomain;
    }
    if (json.euro_sci_voc) {
      doc.euro_sci_voc = json.euro_sci_voc;
    }
    if (json.keywords) {
      doc.keywords = json.keyword;
    }
    if (json.other) {
      doc.other = json.other;
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
