import { SetaDocument } from '../models/document.model';
import { Resource } from '../models/resource.model';
import { SetaDocumentSerializer } from './document.serializer';
import { Serializer } from './serializer.interface';

export class SetaDocumentsForExport extends Resource {
  public documents: SetaDocument[];

  constructor(data?: Partial<SetaDocumentsForExport>) {
    super();
    Object.assign(this, data);
  }
}

export class SetaExportCorpusSerializer implements Serializer {
  public fromJson(json: any): Resource {
    throw new Error(`Method not implemented.`);
  }

  public toJson(resource: SetaDocumentsForExport): any {
    const json: any = {
      documents: this.deserializeDocuments(resource.documents),
    };
    return JSON.stringify(json);
  }

  public deserializeDocuments(documents: SetaDocument[]): any {
    const serializer = new SetaDocumentSerializer();
    let documentsJson = `[`;
    documents.forEach((document, index) => {
      documentsJson = documentsJson + JSON.stringify(serializer.toJson(document));
      if (index + 1 !== documents.length) {
        documentsJson = documentsJson + `,`;
      }
    });
    return documentsJson + `]`;
  }
}
