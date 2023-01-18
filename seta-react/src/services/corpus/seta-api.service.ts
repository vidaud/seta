import axios from "axios";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import * as meta from "../../assets/new_metadata.json"
import { environment } from "../../environments/environment";
import { Cluster } from "../../models/cluster.model";
import { SetaCorpus } from "../../models/corpus.model";
import { DecadeGraph } from "../../models/decade-graph.model";
import { SetaDocumentMetadata } from "../../models/document-metadata.model";
import { SetaDocument } from "../../models/document.model";
import { EurlexMetadataDto } from "../../models/eurlexMetadataDto.model";
import { OntologyDocnetGraph } from "../../models/ontology-docnet-graph.model";
import { OntologyGraph } from "../../models/ontology-graph.model";
import { VertexDocument } from "../../models/vertex-document.model";
import { Vertex } from "../../models/vertex.model";
import { ClusterSerializer } from "../../serializers/cluster.serializer";
import { CorpusSearchPayloadSerializer } from "../../serializers/corpus-search-payload.serializer";
import { DecadeGraphSerializer } from "../../serializers/decade-graph.serializer";
import { SetaDocumentMetadataSerializer } from "../../serializers/document-metadata.serrializer";
import { SetaDocumentSerializer } from "../../serializers/document.serializer";
import { EurlexMetadataDtoSerializer } from "../../serializers/eurlexMetadataDto.serializer";
import { OntologyDocnetGraphSerializer } from "../../serializers/ontology-docnet-graph.serializer";
import { OntologyGraphSerializer } from "../../serializers/ontology-graph.serializer";
import { Serializer } from "../../serializers/serializer.interface";
// import {
//   SetaDocumentsForExport,
//   SetaExportCorpusSerializer
// } from "../serializers/seta-export-corpus.serializer";
import { VertexDocumentSerializer } from "../../serializers/vertex-document.serializer";
import { VertexSerializer } from "../../serializers/vertex.serializer";
import { CorpusSearchPayload } from "../../store/corpus-search-payload";


export class SetaApiService {
  // public API = `${environment.baseUrl}${environment.baseApplicationContext}${environment.restEndPoint}`;
  public API = `${environment.api_target_path1}`
  public regexService: RegExp = environment._regex;

  constructor() {
  }

  public similar(queryOptions?: URLSearchParams): Observable<Vertex[]> {
    const endpoint = `similar`;

    return axios.get(`${this.API}${endpoint}`, { params: queryOptions }).then(
      (response: any) => {
        return this.convert<Vertex>(response.words, new VertexSerializer());
      }) as any
  }

  public doc_similar(queryOptions?: URLSearchParams): Observable<VertexDocument[]> {
    const endpoint = `doc_similar`;

    return axios.get(`${this.API}${endpoint}`, { params: queryOptions }).then(
      (response: any) => {
        return this.convert<VertexDocument>(response.docs, new VertexDocumentSerializer());
      }) as any
  }

  /**
   * Corpus GET
   * @deprecated
   * @param queryOptions?: HttpParams 
   * @returns Observable<SetaCorpus>
   */
  public corpusGet(queryOptions?: URLSearchParams): Observable<SetaCorpus> {
    const endpoint = `corpus`;
    return axios.get(`${this.API}${endpoint}`, { params: queryOptions }).then(
      (response: any) => {
        if (response){
          const corpus = new SetaCorpus();
          const documents = this.convert<SetaDocument>(response.documents, new SetaDocumentSerializer());
          corpus.documents = [...(documents !== undefined ? documents : [])];
          corpus.total_docs = response.total_docs;
          return corpus;
        }
      }) as any
  }

  /**
   * Corpus POST
   * @param queryOptions?: CorpusSearchPayload | undefined
   * @returns Observable<SetaCorpus>
   */
  public corpus(queryOptions?: CorpusSearchPayload | undefined): Observable<SetaCorpus> {
    const endpoint = `corpus`;
    let cspSerializer = new CorpusSearchPayloadSerializer();
    return axios.post(`${this.API}${endpoint}`, cspSerializer.toJson(queryOptions!), {
      headers: { 
        "Content-Type": "application/json"
      }
    }).then((response: any) => {
        if (response){
          const corpus = new SetaCorpus();
          const documents = this.convert<SetaDocument>(response.documents, new SetaDocumentSerializer());
          corpus.documents = [...(documents !== undefined ? documents : [])];
          corpus.total_docs = response.total_docs;
          return corpus;
        }
      }) as any
  }

  public corpus_id(id: string): Observable<SetaDocumentMetadata> {
    const endpoint = `corpus/${id}`;

    return axios.get(`${this.API}${endpoint}`).then(
      (response: any) => {
        return new SetaDocumentMetadataSerializer().fromJson(response);
      }) as any
  }

  public metadata(): Observable<EurlexMetadataDto> {
    return of(new EurlexMetadataDtoSerializer().fromJson(meta[`default`]));
  }

  public wiki(queryOptions?: URLSearchParams): Observable<SetaDocument[]> {
    const endpoint = `wiki`;

    return axios.get(`${this.API}${endpoint}`, { params: queryOptions }).then(
      (response: any) => {
        return this.convert<SetaDocument>(response.documents, new SetaDocumentSerializer());
      }) as any
  }

  public clusters(queryOptions?: URLSearchParams): Observable<Cluster[]> {
    const endpoint = `clusters`;

    return axios.get(`${this.API}${endpoint}`, { params: queryOptions }).then(
      (response: any) => {
        return this.convert<Cluster>(response.clusters, new ClusterSerializer());
      }) as any
  }

  public ontology(queryOptions?: URLSearchParams): Observable<OntologyGraph[]> {
    const endpoint = `ontology`;

    return axios.get(`${this.API}${endpoint}`, { params: queryOptions }).then(
      (response: any) => {
        return [new OntologyGraphSerializer().fromJson(response)];
      }) as any
  }

  public ontology_docnet(queryOptions?: URLSearchParams): Observable<OntologyDocnetGraph[]> {
    const endpoint = `doc_ontology`;

    return axios.get(`${this.API}${endpoint}`, { params: queryOptions }).then(
      (response: any) => {
        return [new OntologyDocnetGraphSerializer().fromJson(response)];
      }) as any
  }

  public decade(queryOptions?: URLSearchParams): Observable<DecadeGraph> {
    const endpoint = `decade`;

    return axios.get(`${this.API}${endpoint}`, { params: queryOptions }).then(
      (response: any) => {
        return new DecadeGraphSerializer().fromJson(response.graph[0]);
      }) as any
  }

  public suggestions(queryOptions?: URLSearchParams): Observable<string[]> {
    const endpoint = `suggestions`;

    return axios.get(`${this.API}${endpoint}`, { params: queryOptions }).then(
      (response: any) => {
        return response.words.map((word: string) => {
          return word.replace(this.regexService, ` `);
        });
      }) as any
  }
//   /**
//    * Return excel document from middleware
//    * MISSING PYTHON ENDPOINT
//    * @param body 
//    * @returns 
//    */
//   exportExcel(body: SetaDocumentsForExport) {
//     const API = `${environment.baseUrl}${environment.baseApplicationContext}`;
//     const endpoint = `rest/state/export`;
//     const serializer = new SetaExportCorpusSerializer();
//     return this.httpClient.post(`${API}${endpoint}`, JSON.stringify(body), {
//       responseType: `arraybuffer`,
//       observe: `response`
//     });
//   }

  public retrieveEmbeddings(type: string, body: {"fileToUpload": File, "text": string}) {
    const endpoint = 'compute_embeddings';
    const api = "/seta-api/api/v1/";
    if (type === "file") {
      const formData = new FormData();
      formData.append("file", body.fileToUpload);
      return axios.post(`${api}${endpoint}`, formData)
    } else {
      return axios.post(`${api}${endpoint}`, {text: body.text})
    }
  }

  getContentJSON() {
    return axios.get("/assets/eurovoc_in_skos_core_concepts-tree (1).json").then(
      (response: any) => {
        return response.json();
      })
  }

  public convert<T>(items: any, serializer: Serializer): T[] | undefined{
    if (items) {
      return items.map(item => serializer.fromJson(item));
    }
  }

//   private getServerErrorMessage(error: HttpErrorResponse): string {
//     switch (error.status) {
//       case 404: {
//         return `Not Found: ${error.message}`;
//       }
//       case 403: {
//         return `Access Denied: ${error.message}`;
//       }
//       case 500: {
//         return `Internal Server Error: ${error.message}`;
//       }
//       default: {
//         return `Unknown Server Error: ${error.message}`;
//       }
//     }
//   }
}