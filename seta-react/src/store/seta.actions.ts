import { Term } from '../models/term.model';
import { CorpusSearchPayload } from './corpus-search-payload';

export class MainSearch {
  public static readonly type = `[Main] Search`;
  constructor(public term: string) { }
}

export class MainDocnetSearch {
  public static readonly type = `[MainDocnet] Search`;
  constructor(public id: string) { }
}

export class SimilarSearch {
  public static readonly type = `[Similar] Search`;
  constructor(public term: string, public nterm?: number) { }
}

export class SimilarSearchConceptPage {
  public static readonly type = `[SimilarConceptPage] Search`;
  constructor(public term: string, public nterm?: number) { }
}

export class SimilarVoid {
  public static readonly type = `[Similar] Void`;
  constructor() { }
}

export class SimilarDocumentSearch {
  public static readonly type = `[SimilarDocument] Search`;
  constructor(public id: string, public ndoc?: number) { }
}

export class ClusterSearch {
  public static readonly type = `[Cluster] Search`;
  constructor(public term: string) { }
}

export class CorpusSearch {
  public static readonly type = `[Corpus] Search`;
  constructor(public corpusSearchPayload: CorpusSearchPayload) { }
}

export class CorpusSearchConceptPage {
  public static readonly type = `[CorpusConceptPage] Search`;
  constructor(public corpusSearchPayload: CorpusSearchPayload) { }
}

export class CorpusVoid {
  public static readonly type = `[Corpus] Void`;
  constructor() { }
}

export class CorpusID {
  public static readonly type = `[CorpusID] Search`;
  constructor(public id: string) { }
}

export class CorpusIdDcumentPage {
  public static readonly type = `[CorpusIdDcumentPage] Search`;
  constructor(public id: string) { }
}

export class CorpusMetadata {
  public static readonly type = `[CorpusMetadata] Search`;
  constructor() { }
}

export class WikiSearch {
  public static readonly type = `[Wiki] Search`;
  constructor(public term: string, public ndocs?: number) { }
}

export class OntologySearch {
  public static readonly type = `[Ontology] Search`;
  constructor(public term: string) { }
}

export class OntologyDocnetSearch {
  public static readonly type = `[OntologyDocnet] Search`;
  constructor(public id: string) { }
}

export class DecadeSearch {
  public static readonly type = `[Decade] Search`;
  constructor(public term: string) { }
}

export class SuperSearch {
  public static readonly type = `[SuperSearch] Search`;
  constructor(public keywords: Term[], public nsents?: number) { }
}

export class ExcelExport {
  public static readonly type = `[ExcelExport] Export`;
  constructor() { }
}

export class ResetCorpusState {
  public static readonly type = `[ResetCorpusState] Reset`;
  constructor() { }
}

export class SaveCorpusState {
  public static readonly type = `[SaveCorpusState] Save`;
  constructor(public name: string) { }
}


export class SaveQueryState {
  public static readonly type = `[Save Query] SaveQueryState`;
  constructor(public name: string) { }
}

export class LoadQueryState {
  public static readonly type = `[Load Query] LoadQueryState`;
  constructor(public name: string) { }
}


export class ClearSearchTerms {
  public static readonly type = `[Search Page] Clear Search Terms`;
  constructor() { }
}

export class LoadingApp {
  public static readonly type = `[Load Page] Load`;
  constructor(public isLoading: boolean) { }
}