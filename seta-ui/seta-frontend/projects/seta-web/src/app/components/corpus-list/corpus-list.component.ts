import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { faHubspot, faUncharted } from '@fortawesome/free-brands-svg-icons';
import { faFile, faFileCode, faFileExcel, faFilePdf, faWindowClose as farWindowClose } from '@fortawesome/free-regular-svg-icons';
import { faAlignLeft, faAngleDoubleDown, faAngleDoubleRight, faAngleDoubleUp, faBrain, faCalendar, faCodeBranch, faCogs, faEraser, faExternalLinkAlt, faFileImport, faMagic, faMapPin, faProjectDiagram, faSearch, faSort, faSortAmountDown, faSortDown, faSortUp, faSquare, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { ColumnMode, DatatableComponent, SelectionType, SortType } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs';
import { CelexLink, ConcordancePermutation, DomainsModel, ResourceType, SetaDocument, SetaElement, SetaHighLight, SubjectType } from '../../models/document.model';
import { DocumentSector, EurlexMetadataDto } from '../../models/eurlexMetadataDto.model';
import { EurovocThesaurusModel } from '../../models/eurovoc-thesaurus.model';
import { Term, TermType } from '../../models/term.model';
import { CorpusCentralService, Modes } from '../../services/corpus-central.service';
import { CorpusFilterDatatable } from '../../services/corpus-filter.service';
import { CorpusParamHistoryService } from '../../services/corpus-param-history.service';
import { CustomDateParserFormatter } from '../../services/custom-formatter';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';
import { SetaStateCorpus } from '../../store/seta-corpus.state';
import { SetaState } from '../../store/seta.state';
declare var $: any;


interface PageInfo {
  offset: number;
  pageSize: number;
  limit: number;
  count: number;
}

class ConcordanceWidth {
  left: string
  center: string
  right: string

  constructor(data?: Partial<ConcordanceWidth>) {
    Object.assign(this, data);
  }
}

enum PropToKeywords {
  documentReference = `reference.keyword`,
  collection = `collection.keyword`,
  title = `title.keyword`,
  repository = `source.keyword`,
}

@Component({
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
  selector: `app-corpus-list`,
  styleUrls: [`./corpus-list.component.scss`],
  templateUrl: `./corpus-list.component.html`,
})
export class CorpusListComponent implements OnInit, AfterViewChecked {
  @Select(SetaStateCorpus.corpusDocuments)
  public corpusDocuments$: Observable<SetaDocument[]>;

  @Select(SetaStateCorpus.corpusSearchPayload)
  public corpusParameters$: Observable<CorpusSearchPayload>;

  @Select(SetaState.eurlexMetadata)
  public eurlexMetadata$: Observable<EurlexMetadataDto>;

  @Select(SetaStateCorpus.total_docs)
  public total_docs$: Observable<number>;

  @ViewChild('simple', { read: TemplateRef, static: true })
  stringTemplateRef: TemplateRef<any>

  @ViewChild('thumbnail', { read: TemplateRef, static: true })
  thumbnailTemplateRef: TemplateRef<any>

  @ViewChild('noSort', { read: TemplateRef, static: true })
  noSort: TemplateRef<any>

  @ViewChild('asc', { read: TemplateRef, static: true })
  asc: TemplateRef<any>

  @ViewChild('desc', { read: TemplateRef, static: true })
  desc: TemplateRef<any>



  @Output()
  public semanticDocument = new EventEmitter<SetaDocument>();

  public celex_links_type_model = [`all`, `html`, `pdf`,]

  public corpusDocuments: SetaDocument[];
  public paginatedList = [];
  public currentShownList: SetaDocument[];

  @ViewChild(DatatableComponent)
  public table: DatatableComponent;


  public ColumnMode = ColumnMode;
  public SortType = SortType;
  public SelectionType = SelectionType;


  public rows: SetaDocument[] = [];
  public temp: SetaDocument[] = [];
  public expanded: any = {};
  public reorderable = true;

  public faCalendar = faCalendar;
  public farWindowClose = farWindowClose;
  public faFileExcel = faFileExcel;
  public faEraser = faEraser;
  public faFileCode = faFileCode;
  public faFilePdf = faFilePdf;
  public faSearch = faSearch;
  public faExternalLinkAlt = faExternalLinkAlt;
  public faMagic = faMagic;
  public faToggleOff = faToggleOff;
  public faToggleOn = faToggleOn;
  public faHubspot = faHubspot;
  public faCogs = faCogs;
  public faMapPin = faMapPin;
  public faUncharted = faUncharted;
  public faBrain = faBrain;
  public faCodeBranch = faCodeBranch;
  public faSquare = faSquare;
  public faFile = faFile;
  public faAlignLeft = faAlignLeft;
  public faProjectDiagram = faProjectDiagram;
  public faFileImport = faFileImport;
  public faSort = faSort;
  public faSortUp = faSortUp;
  public faSortDown = faSortDown;
  public faAngleDoubleUp = faAngleDoubleUp;
  public faAngleDoubleDown = faAngleDoubleDown;
  public faAngleDoubleRight = faAngleDoubleRight;



  public faSortAmountDown = faSortAmountDown;

  public totalElements: number;
  public pageNumber: number;
  public cache: any = {};
  public isDataTableLoading = 0;

  public collapsed = true;

  selectedSimpleItem = 'Date';
  simpleItems = [];

  eurlexFilters: CorpusSearchPayload;

  selected = [];

  // Event Listernes
  @Input()
  public eurlexMFilters: any;

  public textfilter: string;

  public corpusFilters: CorpusFilterDatatable;
  public cp: CorpusSearchPayload;
  public hoveredDate: NgbDate | null = null;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;
  public remainderNumberOfPages: number;
  public lastPage: number;
  public isExpanded = false;
  expandDetectionList = []

  concordanceTableData = {}

  columns = [{ name: 'Repository' }, { name: 'Resources' }, { name: 'Date' }, { name: 'Title' }];

  allColumns = [{ name: 'Repository' }, { name: 'Resources' }, { name: 'Date' }, { name: 'Collection' }, { name: 'Document reference' }];

  columnsDetail = [{ prop: "contextLx", name: 'Left Context' }, { prop: "keyword", name: 'Keyword' }, { prop: "contextRx", name: 'Right Context' }];

  get selectedRTypes() {
    return this.eurlexMFilters.selectedResourceTypes as string[];
  }

  get selectedDSectors() {
    return this.eurlexMFilters.selectedDocumentSectors as DocumentSector[];
  }

  get selectedInfoForce() {
    return this.eurlexMFilters.selectedInfoForce as string;
  }

  get selectedSubjects() {
    return this.eurlexMFilters.selectedSubjectTypes as string[];
  }

  get selectedErovocConcepts() {
    return this.eurlexMFilters.selectedErovocConcepts as EurovocThesaurusModel[];
  }

  public placement = `bottom`;

  public docAuthors: { [x: string]: string; } = {};
  public docSectors: { [x: string]: string; } = {};
  public eurovocMthMapDto: { [x: string]: string; } = {};
  public eurovocDomMapDto: { [x: string]: string; } = {};

  public isMetadataPresent = false;

  constructor(
    private store: Store,
    public formatter: NgbDateParserFormatter,
    public corpusParamHistory: CorpusParamHistoryService,
    private corpusCentral: CorpusCentralService,
    private cdRef: ChangeDetectorRef) {
    this.pageNumber = 0;
  }
  public ngAfterViewChecked(): void {
    if (this.table && this.expandDetectionList.length > 0) {
      if (this.expandDetectionList[0] === `open`) {
        this.table.rowDetail.expandAllRows()
      } else {
        this.table.rowDetail.collapseAllRows()
      }
      this.cdRef.detectChanges();
      this.expandDetectionList = []
    }

  }

  setPage(pageInfo: PageInfo) {
    if (this.pageNumber === pageInfo.offset) { return; }
    this.pageNumber = pageInfo.offset;

    let ndocs = 10;
    if (this.pageNumber === this.lastPage) {
      if (this.remainderNumberOfPages !== 0) {
        ndocs = this.remainderNumberOfPages;
      }
    }
    this.isDataTableLoading++;
    this.corpusCentral.gotToPage(this.pageNumber * 10, ndocs)
  }


  public filterIdSector(d: SetaDocument, filterIdSectors: string[], isSelectedSector: boolean): boolean {
    if (d.idCollection) {
      if (filterIdSectors.indexOf(d.idCollection) >= 0) {
        isSelectedSector = true;
      } else {
        isSelectedSector = false;
      }
    } else {
      isSelectedSector = false;
    }
    return isSelectedSector;
  }

  public filterResourceTypes(d: SetaDocument, resourceCodes: string[], isSelectedResourceTypes: boolean): boolean {
    if (d.reference) {
      const resTcodes = d.reference.map((resTd) => resTd.code);
      for (const res of resTcodes) {
        if (resourceCodes.indexOf(res) >= 0) {
          isSelectedResourceTypes = true;
          break;
        } else {
          isSelectedResourceTypes = false;
        }
      }
    } else {
      isSelectedResourceTypes = false;
    }
    return isSelectedResourceTypes;
  }

  getRowHeight(row) {
    if (!row) {
      return 50;
    }
    if (row.height === undefined) {
      return 50;
    }
    return row.height;
  }

  ngOnInit() {

    this.eurlexMetadata$.subscribe((eurlexMetadata: EurlexMetadataDto) => {
      if (eurlexMetadata) {
        for (const docSector of eurlexMetadata.documentSectors) {
          this.docSectors[docSector.sectorCode] = docSector.sectorLabel;
        }
        for (const key of Object.keys(eurlexMetadata.eurovocMthMapDto)) {
          this.eurovocMthMapDto[key] = eurlexMetadata.eurovocMthMapDto[key];
        }

        for (const key of Object.keys(eurlexMetadata.eurovocDomMapDto)) {
          this.eurovocDomMapDto[eurlexMetadata.eurovocDomMapDto[key]] = key;
        }
      }
    });

    this.corpusParameters$.subscribe((corpusParameters: CorpusSearchPayload) => {
      this.cp = new CorpusSearchPayload({ ...corpusParameters });
    });

    this.total_docs$.subscribe((total_docs) => this.totalElements = total_docs)

    this.corpusDocuments$.subscribe((docList: SetaDocument[]) => {
      this.remainderNumberOfPages = this.totalElements % 10;
      this.lastPage = Math.floor(this.totalElements / 10);
      if (this.table) {
        if (!this.corpusParamHistory.areStatesEquals(0, 1)) {
          this.pageNumber = 0;
          this.table.sorts = []
        } else {
          if (this.table.offset != undefined) {
            this.table.offset = this.pageNumber
            if (this.table.sorts && this.table.sorts.length > 1) {
              this.table.sorts = [this.table.sorts[this.table.sorts.length - 1]]
            }
          }
        }
        if (this.isExpanded) {
          this.expandDetectionList.push(`open`)
        } else {
          this.expandDetectionList.push(`close`)
        }
      }
      this.isDataTableLoading--;
      this.corpusDocuments = docList;
      this.rows = this.corpusDocuments.map((tempdoc: SetaDocument) => {
        console.log(this.rows);
        return new SetaDocument({
          ...tempdoc,
          // celex_links: tempdoc.celex_links ?
          //   this.celex_links_type_model.map((model) => new CelexLink(tempdoc.celex_links.find((link) => link.type === model)))
          //   : undefined,
          // docType: tempdoc.docType ? [...tempdoc.docType] : undefined,
          // eurovoc_mth: tempdoc.eurovoc_mth ? tempdoc.eurovoc_mth.map(
          //   (data) => new ResourceType(data),
          // ) : undefined,
          highlight: tempdoc.highlight ? new SetaHighLight({ text: tempdoc.highlight.text, title: tempdoc.highlight.title }) : undefined,
          reference: tempdoc.reference ? tempdoc.reference.map(
            (data) => new ResourceType(data),
          ) : undefined,
          concordance: [...tempdoc.concordance].map((data) => {
            return new ConcordancePermutation({ ...data })
          })
        });
      });
      this.rows.forEach((row) => {
        this.concordanceTableData[row.id] = {
          column: `all`,
          columnDirection: `noSort`,
          concordance: row.concordance
        }
      })
      this.temp = [...this.rows];
    });

    this.simpleItems = [`Date`, 'Collection'];

    this.corpusCentral.eurlexFilters.subscribe((eurlexFilters) => {
      this.eurlexFilters = new CorpusSearchPayload({ ...eurlexFilters });
    })

  }

  returnCorrectTemplateName(data: SetaElement) {
    if (!data.replacer) {
      return this.stringTemplateRef;
    } else {
      return this.thumbnailTemplateRef;
    }
  }

  concordanceSortTemplate(data: SetaDocument, column: string) {
    if (this.concordanceTableData[data.id]) {
      if (this.concordanceTableData[data.id].column === 'all' || this.concordanceTableData[data.id].column !== column) {
        return this.noSort
      } else {
        switch (this.concordanceTableData[data.id].columnDirection) {
          case 'noSort':
            return this.noSort;
            break;
          case 'asc':
            return this.asc;
            break;
          case 'desc':
            return this.desc;
            break;
          default:
            return this.noSort;
            break;
        }
      }
    } else {
      return this.noSort;
    }
  }


  goToLink(link: string) {
    window.open(link, `_blank`);
  }

  expandAllRows() {
    this.table.rowDetail.expandAllRows();
  }

  collapseAllRows() {
    this.table.rowDetail.collapseAllRows();
  }

  toggleAllRows() {
    if (!this.isExpanded) {
      this.table.rowDetail.expandAllRows()
      this.isExpanded = true
    } else {
      this.table.rowDetail.collapseAllRows();
      this.isExpanded = false
    }
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }


  toggleColumn(col) {
    const isChecked = this.isChecked(col);

    if (isChecked) {
      this.columns = this.columns.filter(c => {
        return c.name !== col.name;
      });
    } else {
      this.columns = [...this.columns, col];
    }
  }

  /**
   * isColumnVisible
   * @param currentValue 
   */
  public isColumnVisible(currentValue: string) {
    return this.columns.find((col) => {
      return currentValue === col.name
    })
  }

  isChecked(col) {
    return (
      this.columns.find(c => {
        return c.name === col.name;
      }) !== undefined
    );
  }

  /**
   * onSort
   * @param event 
   */
  public onSort(event) {
    let prop = PropToKeywords[event.column.prop]
    if (!prop) {
      prop = event.column.prop
    }
    this.corpusCentral.sort(event.newValue ? [`${prop}:${event.newValue}`] : undefined)
  }


  toggleSemanticSortByDocument(id: string) {
    /* before starting the new call I have find and send the document to the tick component */
    const documentsSelected: SetaDocument[] = this.rows.filter((document) => { return document.id === id })
    this.semanticDocument.emit(new SetaDocument({ ...documentsSelected[0] }))
    if (Modes[this.corpusCentral._mode.getValue()] === `Lazy`) {
      this.corpusCentral.semantic_document = documentsSelected !== null ? documentsSelected : null
    } else {
      // Now we allow only one document at a time, in the furure this might change
      // Therefore I am filtering all previous documents before adding the new selected one
      let eurlesFiltersWithiutDocuments = this.eurlexFilters.termCorpus.filter((term) => term.termType !== TermType.DOCUMENT)
      this.corpusCentral.eurlexFilters.next(
        new CorpusSearchPayload(
          {
            ...this.eurlexFilters,
            termCorpus: [...eurlesFiltersWithiutDocuments, new Term(
              {
                display: documentsSelected[0].id,
                value: documentsSelected[0].title,
                termType: TermType.DOCUMENT,
                isOperator: false,
                document: new SetaDocument({ ...documentsSelected[0] })
              })],
              semantic_sort_id: documentsSelected[0]._id !== null ? documentsSelected[0]._id : null
            }
          ));
        this.corpusCentral.search()
        this.corpusCentral.sortByDocument(documentsSelected[0]._id)
    }

  }

  /**
   * sortLeft
   */
  public sortLeft(document: SetaDocument) {
    let tempConc = [...this.concordanceTableData[document.id].concordance]
    let columnDirection = this.concordanceSorting(document, `contextLx`)
    if (columnDirection === `noSort`) {
      document.concordance = this.concordanceTableData[document.id].concordance
    } else {
      tempConc.sort((a, b) => {
        return ('' + a.contextLx).toLowerCase().split('').reverse().join().localeCompare(('' + b.contextLx).toLocaleLowerCase().split('').reverse().join());
      })
      if (columnDirection === `desc`) {
        document.concordance = tempConc.reverse()
      } else {
        document.concordance = tempConc
      }
    }
  }

  /**
   * sortKeyword
   */
  public sortKeyword(document: SetaDocument) {
    let tempConc = [...this.concordanceTableData[document.id].concordance]
    let columnDirection = this.concordanceSorting(document, `keyword`)
    if (columnDirection === `noSort`) {
      document.concordance = this.concordanceTableData[document.id].concordance
    } else {
      tempConc.sort((a, b) => {
        return ('' + a.keyword).toLowerCase().localeCompare(('' + b.keyword).toLocaleLowerCase());
      })
      if (columnDirection === `desc`) {
        document.concordance = tempConc.reverse()
      } else {
        document.concordance = tempConc
      }
    }

  }

  /**
   * sortRight
   */
  public sortRight(document: SetaDocument) {

    let tempConc = [...this.concordanceTableData[document.id].concordance]
    let columnDirection = this.concordanceSorting(document, `contextRx`)
    if (columnDirection === `noSort`) {
      document.concordance = this.concordanceTableData[document.id].concordance
    } else {
      tempConc.sort((a, b) => {
        return ('' + a.contextRx).toLowerCase().localeCompare(('' + b.contextRx).toLocaleLowerCase());
      })
      if (columnDirection === `desc`) {
        document.concordance = tempConc.reverse()
      } else {
        document.concordance = tempConc
      }
    }
  }



  concordanceSorting(document: SetaDocument, column: string) {
    let columnStates = [`noSort`, `asc`, `desc`];
    let columnDirection = null
    let indexOfPresentState = columnStates.indexOf(this.concordanceTableData[document.id].columnDirection)
    if (this.concordanceTableData[document.id].column !== column) {
      columnDirection = columnStates[1]
    } else {
      if (indexOfPresentState < 2) {
        columnDirection = columnStates[indexOfPresentState + 1]
      } else {
        columnDirection = columnStates[0]
      }
    }
    this.concordanceTableData[document.id].columnDirection = columnDirection;
    this.concordanceTableData[document.id].column = column
    return columnDirection

  }




}
