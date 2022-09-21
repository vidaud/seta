import { VertexDocument } from '../models/vertex-document.model';
import { Serializer } from './serializer.interface';

export class VertexDocumentSerializer implements Serializer {
  fromJson(json: any): VertexDocument {
    const doc = new VertexDocument();
    doc.similarDocId = json.similar_doc_id;
    doc.similarity = json.similarity;
    doc.source = json.source;
    doc.title = json.title;
    return doc;
  }
  toJson(resource: VertexDocument) {
    throw new Error(`Method not implemented.`);
  }
}
