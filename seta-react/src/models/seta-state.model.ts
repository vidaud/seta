import { CorpusSearchPayload } from '../store/corpus-search-payload';
import { Cluster } from './cluster.model';
import { DecadeGraph } from './decade-graph.model';
import { SetaDocumentMetadata } from './document-metadata.model';
import { SetaDocument } from './document.model';
import { EurlexMetadataDto } from './eurlexMetadataDto.model';
import { OntologyDocnetGraph } from './ontology-docnet-graph.model';
import { OntologyGraph } from './ontology-graph.model';
import { VertexDocument } from './vertex-document.model';
import { Vertex } from './vertex.model';

export interface SetaStateModel {
  term: string;
  idDoc: string;
  vertexes: Vertex[];
  vertexDocuments: VertexDocument[];
  wikiDocuments: SetaDocument[];
  corpusDocumentMetadata: SetaDocumentMetadata;
  clusters: Cluster[];
  ontologyGraph: OntologyGraph;
  ontologyDocnetGraph: OntologyDocnetGraph;
  decadeGraph: DecadeGraph;
  eurlexMetadata: EurlexMetadataDto;
  corpusSearchPayload: CorpusSearchPayload;
  corpusDocuments: SetaDocument[];
  total_docs: number;
  isLoading: boolean;
}

export interface SetaStateCorpusModel {
  term: string;
  corpusSearchPayload: CorpusSearchPayload;
  corpusDocumentMetadata: SetaDocumentMetadata;
  vertexes: Vertex[];
  corpusDocuments: SetaDocument[];
  total_docs: number;
}