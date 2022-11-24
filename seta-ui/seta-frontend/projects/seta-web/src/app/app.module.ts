import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, NG_VALIDATORS, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // this is needed!
import { TreeModule as tmodule } from '@circlon/angular-tree-component';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  NgbAlertModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPopoverModule,
  NgbToastModule,
  NgbTooltipModule
} from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxsModule } from "@ngxs/store";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { TagInputModule } from "ngx-chips";
import { AccordionModule } from "primeng/accordion";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from "primeng/menu";
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { TreeModule } from 'primeng/tree';
import { AppComponent, NgbdModalContent } from "./app.component";
import { routing } from "./app.routes";
import { AboutComponent } from "./components/about/about.component";
import { AppToastsComponent } from "./components/app-toasts/app-toasts.component";
import { CorpusFindallCardComponent } from "./components/corpus-findall-card/corpus-findall-card.component";
import { CorpusListComponent } from "./components/corpus-list/corpus-list.component";
import { CorpusOverviewComponent } from "./components/corpus-overview/corpus-overview.component";
import { CorpusComponent } from "./components/corpus/corpus.component";
import { DecadesGraphComponent } from "./components/decades-graph/decades-graph.component";
import { DynamicTreeComponent } from "./components/dynamic-tree/dynamic-tree.component";
import { EurlexFiltersComponent } from "./components/eurlex-filters/eurlex-filters.component";
import { FindAllComponent } from "./components/find-all/find-all.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HomeComponent } from "./components/home/home.component";
import { LoadingComponent } from './components/loading/loading.component';
import { LoginComponent } from "./components/login/login.component";
import { MainNavbarComponent } from "./components/main-navbar/main-navbar.component";
import { DeleteFolderComponent } from './components/modals/delete-folder/delete-folder.component';
import { NgbdModalCopy } from "./components/modals/modals";
import { MyAccountComponent } from "./components/my-account/my-account.component";
import { MySearchesComponent } from "./components/my-searches/my-searches.component";
import { NestedDynamicViewComponent } from "./components/nested-dynamic-view/nested-dynamic-view.component";
import { QueryStoreTreeComponent } from './components/query-store-tree/query-store-tree.component';
import { SearchCorpusChipsComponent } from "./components/search-corpus-chips/search-corpus-chips.component";
import { SearchFormComponent } from "./components/search-form/search-form.component";
import { SetaAdvancedFiltersComponent } from "./components/seta-advanced-filters/seta-advanced-filters.component";
import { SimilarGraphComponent } from "./components/similar-graph/similar-graph.component";
import { SimilarComponent } from "./components/similar/similar.component";
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';
import { WikiComponent } from "./components/wiki/wiki.component";
import { ClickOutsideDirective } from "./directives/click-outside.directive";
import { CanActivateUserGuard } from "./guards/can-activate-user.guard";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { LoadingInterceptor } from "./interceptors/loading.interceptor";
import { ReplacePipe } from "./pipes/replace.pipe";
import { ngxsConfig } from "./store/ngxs.config";
import { SetaStateCorpus } from "./store/seta-corpus.state";
import { SetaState } from "./store/seta.state";



@NgModule({
  declarations: [
    AppComponent,
    SimilarComponent,
    CorpusComponent,
    SimilarGraphComponent,
    MainNavbarComponent,
    SearchFormComponent,
    WikiComponent,
    CorpusListComponent,
    HomeComponent,
    CorpusOverviewComponent,
    DecadesGraphComponent,
    FindAllComponent,
    ReplacePipe,
    FooterComponent,
    ClickOutsideDirective,
    CorpusFindallCardComponent,
    AboutComponent,
    NgbdModalContent,
    NestedDynamicViewComponent,
    SearchCorpusChipsComponent,
    SetaAdvancedFiltersComponent,
    EurlexFiltersComponent,
    AppToastsComponent,
    LoginComponent,
    MyAccountComponent,
    MySearchesComponent,
    NgbdModalCopy,
    DynamicTreeComponent,
    DeleteFolderComponent,
    QueryStoreTreeComponent,
    LoadingComponent,
    UploadDocumentComponent,
  ],
  imports: [
    CommonModule,
    TagInputModule,
    BrowserAnimationsModule,
    BrowserModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    routing,
    FormsModule,
    AccordionModule,
    ButtonModule,
    MenuModule,
    NgbDropdownModule,
    NgSelectModule,
    NgbCollapseModule,
    HttpClientModule,
    NgbAlertModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbToastModule,
    NgbPopoverModule,
    ProgressBarModule,
    NgxsModule.forRoot([SetaState, SetaStateCorpus], ngxsConfig),
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: `No data to display`, // Message to show when array is presented, but contains no values
        totalMessage: `total`, // Footer total message
        selectedMessage: `selected` // Footer selected message
      }
    }),
    TreeModule,
    ToastModule,
    DropdownModule,
    ContextMenuModule,
    DialogModule,
    tmodule,
    /*HttpClientXsrfModule.withOptions({
      cookieName: 'csrf_access_token',
      headerName: 'X-CSRF-TOKEN',
    })*/
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    CanActivateUserGuard,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
