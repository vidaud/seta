import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { SetaStateModel } from '../models/seta-state.model';
import { Term } from '../models/term.model';
import { SetaApiService } from '../services/seta-api.service';
import { CorpusSearchPayload } from './corpus-search-payload';
import { SetaStateCorpus } from './seta-corpus.state';
import * as setaActions from './seta.actions';

const SETA_STATE_TOKEN = new StateToken<SetaStateModel>(`seta`);

@State({
  name: SETA_STATE_TOKEN,
  defaults: {
    term: ``,
    idDoc: ``,
    vertexes: [],
    vertexDocuments: [],
    wikiDocuments: [],
    corpusDocumentMetadata: null,
    clusters: [],
    ontologyGraph: null,
    ontologyDocnetGraph: null,
    decadeGraph: null,
    eurlexMetadata: null,
    corpusSearchPayload: new CorpusSearchPayload({
      termCorpus: [],
      source: [],
      ndocs: null,
      from_doc: null,
      sector: new Set<string>(),
      subject: [],
      res_type: new Set<string>(),
      eurovoc_dom: [],
      eurovoc_mth: [],
      info_force: null,
      sort: [],
    }),
    corpusDocuments: [],
    total_docs: null,
    isLoading: false
  },
  children: [SetaStateCorpus],
})
@Injectable({
  providedIn: 'root',
})
export class SetaState {
  constructor(private setaService: SetaApiService) { }

  @Selector()
  static vertexes(state: SetaStateModel) {
    return state.vertexes;
  }

  @Selector()
  static vertexeDocuments(state: SetaStateModel) {
    return state.vertexDocuments;
  }

  @Selector()
  static ontologyDocnet(state: SetaStateModel) {
    return state.ontologyDocnetGraph;
  }

  @Selector()
  static ontology(state: SetaStateModel) {
    return state.ontologyGraph;
  }

  @Selector()
  static decade(state: SetaStateModel) {
    return state.decadeGraph;
  }

  @Selector()
  static clusters(state: SetaStateModel) {
    return state.clusters;
  }

  @Selector()
  static corpusDocumentMetadata(state: SetaStateModel) {
    return state.corpusDocumentMetadata;
  }

  @Selector()
  static wikiDocuments(state: SetaStateModel) {
    return state.wikiDocuments;
  }

  @Selector()
  static term(state: SetaStateModel) {
    return state.term;
  }

  @Selector()
  static eurlexMetadata(state: SetaStateModel) {
    return state.eurlexMetadata;
  }

  @Selector()
  static corpusDocuments(state: SetaStateModel) {
    return state.corpusDocuments;
  }

  @Selector()
  static total_docs(state: SetaStateModel) {
    return state.total_docs;
  }

  @Selector()
  static is_loading(state: SetaStateModel) {
    return state.isLoading;
  }

  @Action(setaActions.MainSearch)
  main(ctx: StateContext<SetaStateModel>, { term }: setaActions.MainSearch) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      term,
    });
    ctx.dispatch([
      new setaActions.SimilarSearchConceptPage(term, 100),
      new setaActions.CorpusSearchConceptPage(
        new CorpusSearchPayload({ termCorpus: [new Term({ display: term, value: term })], source: [], ndocs: 100 })
      ),
      new setaActions.WikiSearch(term, 20),
      new setaActions.OntologySearch(term),
      new setaActions.DecadeSearch(term),
    ]);
  }

  @Action(setaActions.MainDocnetSearch)
  main_docnet(ctx: StateContext<SetaStateModel>, { id }: setaActions.MainDocnetSearch) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      idDoc: id,
    });
    ctx.dispatch([
      new setaActions.CorpusID(id),
      new setaActions.SimilarDocumentSearch(id, 100),
      new setaActions.OntologyDocnetSearch(id),
    ]);
  }

  @Action(setaActions.CorpusMetadata)
  metadata(ctx: StateContext<SetaStateModel>) {
    this.setaService.metadata().subscribe((response) => {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        eurlexMetadata: response,
      });
    });
  }

  @Action(setaActions.CorpusID)
  corpus_metadata(ctx: StateContext<SetaStateModel>, { id }: setaActions.CorpusID) {
    this.setaService.corpus_id(id).subscribe((response) => {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        corpusDocumentMetadata: response,
      });
    });
  }

  @Action(setaActions.WikiSearch)
  wiki(ctx: StateContext<SetaStateModel>, { term, ndocs }: setaActions.WikiSearch) {
    this.setaService.wiki(new HttpParams().set(`term`, term).set(`n_docs`, `` + ndocs)).subscribe((response) => {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        wikiDocuments: response,
      });
    });
  }

  @Action(setaActions.SimilarSearchConceptPage)
  similar(ctx: StateContext<SetaStateModel>, { term, nterm }: setaActions.SimilarSearchConceptPage) {
    try {
      this.setaService
        .similar(new HttpParams().set(`term`, term).set(`n_term`, `` + nterm))
        .subscribe((response) => {
          const state = ctx.getState();
          ctx.setState({
            ...state,
            vertexes: response,
          });
        });
      // error is thrown
    } catch (err) {
      console.log('error catched inside @Action wont propagate to ErrorHandler or dispatch subscription');
    }
  }

  @Action(setaActions.SimilarVoid)
  similar_clean(ctx: StateContext<SetaStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      vertexes: [],
    });
  }

  @Action(setaActions.SimilarDocumentSearch)
  doc_similar(ctx: StateContext<SetaStateModel>, { id, ndoc }: setaActions.SimilarDocumentSearch) {
    const httpParams = this.prepareDocSimilarParams(id, ndoc);
    this.setaService.doc_similar(httpParams).subscribe((response) => {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        vertexDocuments: response,
      });
    });
  }

  private prepareDocSimilarParams(id: string, ndoc: number): HttpParams {
    let httpParams = new HttpParams();
    httpParams = httpParams.set(`document_id`, id);
    if (ndoc && ndoc !== 0) {
      httpParams = httpParams.set(`n_doc`, ndoc.toString());
    }
    return httpParams;
  }

  @Action(setaActions.ClusterSearch)
  cluster(ctx: StateContext<SetaStateModel>, { term }: setaActions.ClusterSearch) {
    this.setaService.clusters(new HttpParams().set(`term`, term)).subscribe((response) => {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        clusters: response,
      });
    });
  }

  @Action(setaActions.OntologySearch)
  ontology(ctx: StateContext<SetaStateModel>, { term }: setaActions.OntologySearch) {
    this.setaService.ontology(new HttpParams().set(`term`, term)).subscribe((response) => {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        ontologyGraph: response[0],
      });
    });
  }

  @Action(setaActions.OntologyDocnetSearch)
  ontology_docnet(ctx: StateContext<SetaStateModel>, { id }: setaActions.OntologyDocnetSearch) {
    this.setaService.ontology_docnet(new HttpParams().set(`document_id`, id)).subscribe((response) => {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        ontologyDocnetGraph: response[0],
      });
    });
  }

  @Action(setaActions.DecadeSearch)
  decade(ctx: StateContext<SetaStateModel>, { term }: setaActions.DecadeSearch) {
    this.setaService.decade(new HttpParams().set(`term`, term)).subscribe((response) => {
      const state = ctx.getState();
      ctx.setState({
        ...state,
        decadeGraph: response,
      });
    });
  }

  @Action(setaActions.CorpusSearchConceptPage)
  corpus(ctxcm: StateContext<SetaStateModel>, { corpusSearchPayload }: setaActions.CorpusSearchConceptPage) {
    const httpParams = new CorpusSearchPayload({
      ...corpusSearchPayload,
      termCorpus: corpusSearchPayload.termCorpus
        ? corpusSearchPayload.termCorpus
        : [new Term({ display: ctxcm.getState().term, value: ctxcm.getState().term })],
    })
    this.setaService.corpus(httpParams).subscribe((response) => {
      const state = ctxcm.getState();
      ctxcm.setState({
        ...state,
        corpusDocuments: response.documents,
        total_docs: response.total_docs,
        corpusSearchPayload: new CorpusSearchPayload({ ...corpusSearchPayload }),
      });
    });
  }

  @Action(setaActions.LoadingApp)
  loadingApp(ctx: StateContext<SetaStateModel>, { isLoading }: setaActions.LoadingApp) {
    let state = ctx.getState();
    ctx.setState({
      ...state,
      isLoading: isLoading,
    });

  }
}
