import axios from "axios";
import { environment } from "../../environments/environment";
import { SetaCorpus } from "../../models/corpus.model";
import { SetaDocument } from "../../models/document.model";
import { CorpusSearchPayloadSerializer } from "../../serializers/corpus-search-payload.serializer";
import { SetaDocumentSerializer } from "../../serializers/document.serializer";
import { Serializer } from "../../serializers/serializer.interface";
import { CorpusSearchPayload } from "../../store/corpus-search-payload";

export class CorpusService {
  public API = `${environment.api_target_path1}`
  public regexService: RegExp = environment._regex;

  getDocuments(queryOptions?: CorpusSearchPayload | undefined) {
    const endpoint = `corpus`;
    return axios.get(`${this.API}${endpoint}`, { params: queryOptions })
    .then((response: any) => {
      response.data.documents;
      const corpus = new SetaCorpus();
      const documents = this.convert<SetaDocument>(response.data.documents, new SetaDocumentSerializer());
      corpus.documents = [...(documents !== undefined ? documents : [])];
      corpus.total_docs = response.data.total_docs;
      return response.data.documents;
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response)
        }
    }) as any
  }

  convert<T>(items: any, serializer: Serializer): T[] | undefined{
    if (items) {
      return items.map(item => serializer.fromJson(item));
    }
  }

  postDocuments(queryOptions?: CorpusSearchPayload | undefined) {
    const endpoint = `corpus`;
    let cspSerializer = new CorpusSearchPayloadSerializer();
    return axios.post(`${this.API}${endpoint}`,  cspSerializer.toJson(queryOptions!), {
      headers: { 
        "Content-Type": "application/json"
      }
    })
    .then((response: any) => {
      const corpus = new SetaCorpus();
      const documents = this.convert<SetaDocument>(response.data.documents, new SetaDocumentSerializer());
      corpus.documents = [...(documents !== undefined ? documents : [])];
      corpus.total_docs = response.data.total_docs;
      return response.data.documents;
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response)
        }
    }) as any
  }
}