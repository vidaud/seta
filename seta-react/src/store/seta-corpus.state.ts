import { SetaStateCorpusModel } from '../models/seta-state.model';
import { Term } from '../models/term.model';
import { User } from '../models/user.model';
// import { AppToastService } from '../services/app-toast.service';
import authentificationService from '../services/authentification.service';
import RestService from '../services/rest.service';
import { SetaApiService } from '../services/corpus/seta-api.service';
import { CorpusSearchPayload, CorpusSearchPayloadWrapper } from './corpus-search-payload';
import * as setaActions from './seta.actions';

// const SETA_STATE_TOKEN = new StateToken<SetaStateCorpusModel>(`seta_corpus`);

// @State({
//   name: SETA_STATE_TOKEN,
//   defaults: {
//     term: ``,
//     corpusSearchPayload: new CorpusSearchPayload({
//       termCorpus: [],
//       source: [],
//       ndocs: null,
//       from_doc: null,
//       collection: new Set<string>(),
//       reference: new Set<string>(),
//       eurovoc_dom: [],
//       eurovoc_mth: [],
//       in_force: null,
//       sort: [],
//       semantic_sort_id: ``,
//     }),
//     corpusDocumentMetadata: null,
//     vertexes: [],
//     corpusDocuments: [],
//     total_docs: null,
//   },
// })
export class SetaStateCorpus {
//   currentUser: User = null;
//   constructor(
//     private store: Store,
//     private setaService: SetaApiService,
//     private rest: RestService,
//     private authService: AuthenticationService,
//     private toastService: AppToastService
//   ) {
//     this.authService.currentUserSubject.asObservable().subscribe((currentUser: User) => this.currentUser = currentUser)

//   }

//   @Selector()
//   static vertexes(state: SetaStateCorpusModel) {
//     return state.vertexes;
//   }

//   @Selector()
//   static corpusSearchPayload(state: SetaStateCorpusModel) {
//     return state.corpusSearchPayload;
//   }

//   @Selector()
//   static termCorpus(state: SetaStateCorpusModel) {
//     return state.corpusSearchPayload.termCorpus;
//   }

//   @Selector()
//   static corpusDocumentMetadata(state: SetaStateCorpusModel) {
//     return state.corpusDocumentMetadata;
//   }

//   @Selector()
//   static total_docs(state: SetaStateCorpusModel) {
//     return state.total_docs;
//   }

//   @Selector()
//   static corpusDocuments(state: SetaStateCorpusModel) {
//     return state.corpusDocuments;
//   }

//   @Selector()
//   static semantic_sort_id(state: SetaStateCorpusModel) {
//     return state.corpusSearchPayload.semantic_sort_id;
//   }

//   @Action(setaActions.CorpusSearch)
//   corpus(ctxcm: StateContext<SetaStateCorpusModel>, { corpusSearchPayload }: setaActions.CorpusSearch) {
//     const httpParams = new CorpusSearchPayload({
//       ...corpusSearchPayload,
//       termCorpus: corpusSearchPayload.termCorpus
//         ? corpusSearchPayload.termCorpus
//         : [new Term({ display: ctxcm.getState().term, value: ctxcm.getState().term })],
//     })
//     this.setaService.corpus(httpParams).subscribe((response) => {
//       if (response){
//         const state = ctxcm.getState();
//         ctxcm.setState({
//           ...state,
//           corpusDocuments: response.documents,
//           total_docs: response.total_docs,
//           corpusSearchPayload: new CorpusSearchPayload({ ...corpusSearchPayload }),
//         });
//       }
//     });
//   }

//   @Action(setaActions.SaveCorpusState)
//   saveCorpusQuery(ctx: StateContext<SetaStateCorpusModel>, { name }: setaActions.SaveCorpusState) {
//     this.rest
//       .setState(
//         this.currentUser.username,
//         'corpus-' + name,
//         JSON.stringify(new CorpusSearchPayloadWrapper({ name, payload: ctx.getState().corpusSearchPayload }))
//       )
//       .subscribe((r) => {
//       });
//   }

//   // Action to save the angular state into the DB. Two parts of query 
//   // will be saved, vertexes and termCorpus (chips), with the same name suffix
//   @Action(setaActions.SaveQueryState)
//   saveQuery(ctx: StateContext<SetaStateCorpusModel>, { name }: setaActions.SaveQueryState) {

//     // Set vertexes state in the DB
//     this.rest
//       .setState(
//         this.currentUser.username,
//         'vertexes-' + name,
//         JSON.stringify(ctx.getState().vertexes)
//       )
//       .subscribe((r) => {
//       });

//     // Set corpus state in the DB
//     this.rest
//       .setState(
//         this.currentUser.username,
//         'corpus-' + name,
//         JSON.stringify(ctx.getState().corpusSearchPayload)
//       )
//       .subscribe((r) => {

//         this.toastService.success("State is successfully saved");
//       });
//   }



//   private loadPastCorpusQueries(ctx: StateContext<SetaStateCorpusModel>): CorpusSearchPayload[] | void {
//     this.rest.getState(this.currentUser.username, 'queries').subscribe((response: any) => {
//       const state = ctx.getState();


//     });
//   }

//   private loadTermCorpus(ctx: StateContext<SetaStateCorpusModel>, name: string) {
//     this.rest.getState(this.currentUser.username, 'corpus-' + name).subscribe((r: any) => {

//       console.log("the response is:")
//       console.log(r);


//       let state = ctx.getState();

//       let cspDb = JSON.parse(r.state.value);

//       ctx.setState({
//         ...state,
//         corpusSearchPayload: new CorpusSearchPayload({ ...cspDb.corpusSearchPayload }),

//       });

//       this.toastService.success('State is successfully loaded');
//     });

//   }

//   private loadVertexes(ctx: StateContext<SetaStateCorpusModel>, name: string) {
//     this.rest.getState(this.currentUser.username, 'vertexes-' + name).subscribe((r: any) => {




//       let state = ctx.getState();

//       let vs = JSON.parse(r.state.value);

//       ctx.setState({
//         ...state,
//         vertexes: vs

//       });
//     });
//   }

//   @Action(setaActions.CorpusVoid)
//   corpus_clean(ctx: StateContext<SetaStateCorpusModel>) {
//     const state = ctx.getState();
//     ctx.setState({
//       ...state,
//       corpusDocuments: [],
//     });
//   }

//   @Action(setaActions.CorpusIdDcumentPage)
//   corpus_metadata(ctx: StateContext<SetaStateCorpusModel>, { id }: setaActions.CorpusID) {
//     this.setaService.corpus_id(id).subscribe((response) => {
//       const state = ctx.getState();
//       ctx.setState({
//         ...state,
//         corpusDocumentMetadata: response,
//       });
//     });
//   }

//   @Action(setaActions.SimilarSearch)
//   similar(ctx: StateContext<SetaStateCorpusModel>, { term, nterm }: setaActions.SimilarSearch) {
//     try {
//       this.setaService
//         .similar(new HttpParams().set(`term`, term).set(`n_term`, `` + nterm))
//         .subscribe((response) => {
//           const state = ctx.getState();
//           ctx.setState({
//             ...state,
//             vertexes: response,
//           });
//         });
//       // error is thrown
//     } catch (err) {
//       console.log('error catched inside @Action wont propagate to ErrorHandler or dispatch subscription');
//     }
//   }

//   @Action(setaActions.ResetCorpusState)
//   reset(ctx: StateContext<SetaStateCorpusModel>) {
//     try {
//       const state = ctx.getState();
//       ctx.setState({
//         ...state,
//         corpusDocuments: [],
//         total_docs: null,
//       });
//       // error is thrown
//     } catch (err) {
//       console.log('error catched inside @Action wont propagate to ErrorHandler or dispatch subscription');
//     }
//   }

//   // Action to clear search terms from search page
//   @Action(setaActions.ClearSearchTerms)
//   clearSearchTerms(ctx: StateContext<SetaStateCorpusModel>) {

//     let state = ctx.getState();
//     let cspNew = new CorpusSearchPayload({ ...state.corpusSearchPayload });

//     cspNew.termCorpus = [];

//     ctx.setState({
//       ...state,
//       corpusSearchPayload: cspNew,

//     });

//   }

}