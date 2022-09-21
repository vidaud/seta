import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import * as meta from '../../assets/new_metadata.json';
import { environment } from "../../environments/environment";
import { Cluster } from "../models/cluster.model";
import { SetaCorpus } from "../models/corpus.model";
import { DecadeGraph } from "../models/decade-graph.model";
import { SetaDocumentMetadata } from "../models/document-metadata.model";
import { SetaDocument } from "../models/document.model";
import { EurlexMetadataDto } from "../models/eurlexMetadataDto.model";
import { OntologyDocnetGraph } from "../models/ontology-docnet-graph.model";
import { OntologyGraph } from "../models/ontology-graph.model";
import { VertexDocument } from "../models/vertex-document.model";
import { Vertex } from "../models/vertex.model";
import { ClusterSerializer } from "../serializers/cluster.serializer";
import { CorpusSearchPayloadSerializer } from "../serializers/corpus-search-payload.serializer";
import { DecadeGraphSerializer } from "../serializers/decade-graph.serializer";
import { SetaDocumentMetadataSerializer } from "../serializers/document-metadata.serrializer";
import { SetaDocumentSerializer } from "../serializers/document.serializer";
import { EurlexMetadataDtoSerializer } from "../serializers/eurlexMetadataDto.serializer";
import { OntologyDocnetGraphSerializer } from "../serializers/ontology-docnet-graph.serializer";
import { OntologyGraphSerializer } from "../serializers/ontology-graph.serializer";
import { Serializer } from "../serializers/serializer.interface";
import {
  SetaDocumentsForExport,
  SetaExportCorpusSerializer
} from "../serializers/seta-export-corpus.serializer";
import { VertexDocumentSerializer } from "../serializers/vertex-document.serializer";
import { VertexSerializer } from "../serializers/vertex.serializer";
import { CorpusSearchPayload } from "../store/corpus-search-payload";


@Injectable({
  providedIn: `root`
})
export class SetaApiService {
  // public API = `${environment.baseUrl}${environment.baseApplicationContext}${environment.restEndPoint}`;
  public API = `${environment.api_target_path}`
  public regexService: RegExp = environment._regex;

  constructor(private httpClient: HttpClient) {
  }

  public similar(queryOptions?: HttpParams): Observable<Vertex[]> {
    const endpoint = `similar`;

    return this.httpClient.get(`${this.API}${endpoint}`, { params: queryOptions }).pipe(
      map((response: any) => {
        return this.convert<Vertex>(response.words, new VertexSerializer());
      })
    );
  }

  public doc_similar(queryOptions?: HttpParams): Observable<VertexDocument[]> {
    const endpoint = `doc_similar`;

    return this.httpClient.get(`${this.API}${endpoint}`, { params: queryOptions }).pipe(
      map((response: any) => {
        return this.convert<VertexDocument>(response.docs, new VertexDocumentSerializer());
      })
    );
  }

  /**
   * Corpus GET
   * @deprecated
   * @param queryOptions?: HttpParams 
   * @returns Observable<SetaCorpus>
   */
  public corpusGet(queryOptions?: HttpParams): Observable<SetaCorpus> {
    const endpoint = `corpus`;
    return this.httpClient.get(`${this.API}${endpoint}`, { params: queryOptions }).pipe(
      map((response: any) => {
        const corpus = new SetaCorpus();
        const documents = this.convert<SetaDocument>(response.documents, new SetaDocumentSerializer());
        corpus.documents = [...documents];
        corpus.total_docs = response.total_docs;
        return corpus;
      })
    );
  }

  /**
   * Corpus POST
   * @param queryOptions?: CorpusSearchPayload 
   * @returns Observable<SetaCorpus>
   */
  public corpus(queryOptions?: CorpusSearchPayload): Observable<SetaCorpus> {
    const endpoint = `corpus`;
    let cspSerializer = new CorpusSearchPayloadSerializer();
    return this.httpClient.post(`${this.API}${endpoint}`, cspSerializer.toJson(queryOptions), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }).pipe(
      map((response: any) => {
        const corpus = new SetaCorpus();
        const documents = this.convert<SetaDocument>(response.documents, new SetaDocumentSerializer());
        corpus.documents = [...documents];
        corpus.total_docs = response.total_docs;
        return corpus;
      })
    );
  }

  public corpus_id(id: string): Observable<SetaDocumentMetadata> {
    const endpoint = `corpus/${id}`;

    return this.httpClient.get(`${this.API}${endpoint}`).pipe(
      map((response: any) => {
        return new SetaDocumentMetadataSerializer().fromJson(response);
      })
    );
  }

  public metadata(): Observable<EurlexMetadataDto> {
    return of(new EurlexMetadataDtoSerializer().fromJson(meta[`default`]));
  }

  public wiki(queryOptions?: HttpParams): Observable<SetaDocument[]> {
    const endpoint = `wiki`;

    return this.httpClient.get(`${this.API}${endpoint}`, { params: queryOptions }).pipe(
      map((response: any) => {
        return this.convert<SetaDocument>(response.documents, new SetaDocumentSerializer());
      })
    );
  }

  public clusters(queryOptions?: HttpParams): Observable<Cluster[]> {
    const endpoint = `clusters`;

    return this.httpClient.get(`${this.API}${endpoint}`, { params: queryOptions }).pipe(
      map((response: any) => {
        return this.convert<Cluster>(response.clusters, new ClusterSerializer());
      })
    );
  }

  public ontology(queryOptions?: HttpParams): Observable<OntologyGraph[]> {
    const endpoint = `ontology`;

    return this.httpClient.get(`${this.API}${endpoint}`, { params: queryOptions }).pipe(
      map((response: any) => {
        return [new OntologyGraphSerializer().fromJson(response)];
      })
    );
  }

  public ontology_docnet(queryOptions?: HttpParams): Observable<OntologyDocnetGraph[]> {
    const endpoint = `doc_ontology`;

    return this.httpClient.get(`${this.API}${endpoint}`, { params: queryOptions }).pipe(
      map((response: any) => {
        return [new OntologyDocnetGraphSerializer().fromJson(response)];
      })
    );
  }

  public decade(queryOptions?: HttpParams): Observable<DecadeGraph> {
    const endpoint = `decade`;

    return this.httpClient.get(`${this.API}${endpoint}`, { params: queryOptions }).pipe(
      map((response: any) => {
        return new DecadeGraphSerializer().fromJson(response.graph[0]);
      })
    );
  }

  public suggestions(queryOptions?: HttpParams): Observable<string[]> {
    const endpoint = `suggestions`;

    return this.httpClient.get(`${this.API}${endpoint}`, { params: queryOptions }).pipe(
      map((response: any) => {
        return response.words.map((word: string) => {
          return word.replace(this.regexService, ` `);
        });
      })
    );
  }
  /**
   * Return excel document from middleware
   * MISSING PYTHON ENDPOINT
   * @param body 
   * @returns 
   */
  exportExcel(body: SetaDocumentsForExport) {
    const API = `${environment.baseUrl}${environment.baseApplicationContext}`;
    const endpoint = `rest/state/export`;
    const serializer = new SetaExportCorpusSerializer();
    return this.httpClient.post(`${API}${endpoint}`, JSON.stringify(body), {
      responseType: `arraybuffer`,
      observe: `response`
    });
  }

  public retrieveEmbeddings(type: string, body: {"fileToUpload": File, "text": string}): Observable<HttpEvent<any>> {
    const endpoint = 'compute_embeddings'
    if (type === "file") {
      const formData = new FormData();
      formData.append("file", body.fileToUpload);
      return this.httpClient.post(`${this.API}${endpoint}`, formData, {
        reportProgress: true,
        observe: 'events'
      })
    } else {
      return this.httpClient.post(`${this.API}${endpoint}`, {text: body.text}, {
        reportProgress: true,
        observe: 'events'
      })
    }
  }

  getContentJSON() {
    return this.httpClient.get("/assets/eurovoc_in_skos_core_concepts-tree (1).json").pipe(
      map((response: any) => {
        return response.json();
      })
    );
  }

  public convert<T>(items: any, serializer: Serializer): T[] {
    return items.map(item => serializer.fromJson(item));
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 403: {
        return `Access Denied: ${error.message}`;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error: ${error.message}`;
      }
    }
  }
}
