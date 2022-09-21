import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { Observable, Subject, Subscription } from 'rxjs';
import { finalize, throttleTime } from 'rxjs/operators';
import { isFileUploadFormValid } from '../../directives/checkSyntax.directive';
import { EmbeddingsModel } from '../../models/embeddings.model';
import { Term, TermType } from '../../models/term.model';
import { CorpusCentralService } from '../../services/corpus-central.service';
import { SetaApiService } from '../../services/seta-api.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';


@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {

  fileToUpload: File | null = null;
  public faSearch = faSearch;

  uploadProgress: number;
  uploadSub: Subscription;

  public uploadFormSubject$: Subject<Event> = new Subject();

  semanticDocUp: FormGroup
  submitted: boolean = false;
  embeddings: EmbeddingsModel | null = null;
  eurlexFilters: CorpusSearchPayload;

  constructor(public modal: NgbActiveModal, private fb: FormBuilder,
    private setaApi: SetaApiService, private messageService: MessageService, private corpusCentral: CorpusCentralService) {

    this.semanticDocUp = this.fb.group({
      file: [''],
      text: [''],
    }, { validators: isFileUploadFormValid() })
  }

  get text() {
    return this.semanticDocUp.get(`text`);
  }

  get file() {
    return this.semanticDocUp.get(`file`);
  }


  ngOnInit(): void {
    this.uploadFormSubject$.pipe(throttleTime(500)).subscribe((event: any) => {
      this.applySearch();
    });

    this.corpusCentral.eurlexFilters.subscribe((eurlexFilters) => {
      this.eurlexFilters = new CorpusSearchPayload({ ...eurlexFilters });
    })
  }

  applySearch() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.semanticDocUp.invalid) {
      return;
    }

    if (this.text.value !== '') {
      this.getEmbeddings("text", { "fileToUpload": undefined, "text": this.text.value })
    } else {
      this.toggleSemanticSortByDocument()
    }

  }

  handleFileInput(files: FileList) {

    const file: File = files[0];

    if (file) {
      this.getEmbeddings("file", { "fileToUpload": file, "text": "" });
    }
  }

  private getEmbeddings(type: string, body: { "fileToUpload": File, "text": string }) {
    let upload$: Observable<HttpEvent<any>>;
    upload$ = this.setaApi.retrieveEmbeddings(type, body).pipe(
      finalize(() => this.reset())
    );

    this.uploadSub = upload$.subscribe(event => {
      if (type === "file") {
        this.loadEmbeddingsProgress(event, body.fileToUpload);
      } else {
        this.loadEmbeddingsProgress(event, null);
      }

    });
  }

  /** Return distinct message for sent, upload progress, & response events */
  private loadEmbeddingsProgress(event: HttpEvent<any>, file?: File) {
    switch (event.type) {

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        break;

      case HttpEventType.Response:
        this.fileToUpload = file
        if (file != null) {
          this.file.patchValue(file.name)
        }
        this.embeddings = new EmbeddingsModel({ ...event.body.embeddings })
        if (this.submitted) {
          this.toggleSemanticSortByDocument()
        }
        break;

    }
  }

  toggleSemanticSortByDocument() {
    let eurlesFiltersWithiutDocuments = []
    if (this.eurlexFilters.termCorpus) {
      eurlesFiltersWithiutDocuments = this.eurlexFilters.termCorpus.filter((term) => term.termType !== TermType.DOCUMENT)
    }
    this.corpusCentral.eurlexFilters.next(
      new CorpusSearchPayload(
        {
          ...this.eurlexFilters,
          termCorpus: [...eurlesFiltersWithiutDocuments, new Term(
            {
              display: this.text.value && this.text.value !== '' ? this.text.value.slice(0, 20) + '...' : this.fileToUpload.name,
              value: this.text.value && this.text.value !== '' ? this.text.value : this.fileToUpload.name,
              termType: TermType.DOCUMENT,
              isOperator: false,
              embeddings: this.embeddings,
              file: this.fileToUpload !== null ? this.fileToUpload : null,
              text: this.text.value !== '' ? this.text.value : null
            })],
          vector: this.embeddings.vector
        }
      ));
    this.corpusCentral.search()
    this.modal.dismiss('form submitted')
    // this.corpusCentral.sortByDocument(id)

  }


  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }

  onReset() {
    this.submitted = false;
    this.semanticDocUp.reset();
  }


}

