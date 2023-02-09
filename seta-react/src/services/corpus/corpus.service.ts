import axios, { AxiosError } from "axios";
import { environment } from "../../environments/environment";
import { SetaCorpus } from "../../models/corpus.model";
import { SetaDocument } from "../../models/document.model";
import { CorpusSearchPayloadSerializer } from "../../serializers/corpus-search-payload.serializer";
import { SetaDocumentSerializer } from "../../serializers/document.serializer";
import { Serializer } from "../../serializers/serializer.interface";
import { CorpusSearchPayload } from "../../store/corpus-search-payload";
import authentificationService from "../authentification.service";
import restService from "../rest.service";

export class CorpusService {
  public API = `${environment.api_target_path}`
  public regexService: RegExp = environment._regex;

  getRefreshedToken() {
    const currentTimestamp = new Date().getTime() / 1E3 | 0;
    const accessExpirationTime = restService.getCookie('access_expire_cookie');
    const refreshExpirationTime = restService.getCookie('refresh_expire_cookie');
    if(Number(accessExpirationTime) < currentTimestamp && Number(refreshExpirationTime) > currentTimestamp) {
      console.log('isExpired')
      return authentificationService.refreshToken();
    }
  }

  getDocuments(queryOptions?: CorpusSearchPayload | undefined) {
    this.getRefreshedToken();
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
          this.handle401Error(error);
        }
      }) as any
  }

  convert<T>(items: any, serializer: Serializer): T[] | undefined{
    if (items) {
      return items.map(item => serializer.fromJson(item));
    }
  }

  postDocuments(queryOptions?: CorpusSearchPayload | undefined) {
    let items = undefined;
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
        items = response.data.total_docs;
        return response.data.documents;
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          this.handle401Error(error);
        }
      }) as any
  }

  private handle401Error = async (error: AxiosError) => {
    if (error.response?.status === 401) {
        return authentificationService.refreshToken();
    }
  }
}