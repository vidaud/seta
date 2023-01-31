import axios from "axios";
import { catchError, switchMap, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { SetaCorpus } from "../../models/corpus.model";
import { SetaDocument } from "../../models/document.model";
import { CorpusSearchPayloadSerializer } from "../../serializers/corpus-search-payload.serializer";
import { SetaDocumentSerializer } from "../../serializers/document.serializer";
import { Serializer } from "../../serializers/serializer.interface";
import { CorpusSearchPayload } from "../../store/corpus-search-payload";
import authentificationService from "../authentification.service";

export class CorpusService {
  public API = `${environment.api_target_path}`
  public regexService: RegExp = environment._regex;

  getDocuments(queryOptions?: CorpusSearchPayload | undefined) {
    const endpoint = `corpus`;
    return axios.get(`${this.API}${endpoint}`, { params: queryOptions})
    .then((response: any) => {
      const corpus = new SetaCorpus();
      const documents = this.convert<SetaDocument>(response.data.documents, new SetaDocumentSerializer());
      corpus.documents = [...(documents !== undefined ? documents : [])];
      corpus.total_docs = response.data.total_docs;
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response);
        if(error.response.status==401){
          //redirect to login
          //return window.location.href = '/refresh'
          return this.handle401Error();
        }
        //authentificationService.setaLogout();
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
        console.log(error.response);
        if(error.response.status==401){
          //redirect to login
          return this.handle401Error();
        }
        //authentificationService.setaLogout();
        }
    }) as any
  }

  handle401Error() {
    return authentificationService.refreshCookie();
  }
}