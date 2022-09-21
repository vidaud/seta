import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faFilter, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { AdvancedFiltersModel } from '../../models/advanced-filters.model';
import { EurlexFormModel } from '../../models/eurlex-form.model';
import { Resource } from '../../models/resource.model';
import { CorpusCentralService } from '../../services/corpus-central.service';
import { CorpusSearchPayload } from '../../store/corpus-search-payload';

export class AdvancedFiltersForm {
  selectedRepositoryTypes: string[];
  eurlexForm: EurlexFormModel;

  constructor(data?: Partial<AdvancedFiltersForm>) {
    Object.assign(this, data);
  }
}

@Component({
  selector: 'app-seta-advanced-filters',
  templateUrl: './seta-advanced-filters.component.html',
  styleUrls: ['./seta-advanced-filters.component.scss']
})
export class SetaAdvancedFiltersComponent implements OnInit {
  advancedFilters: FormGroup;
  formMemory: AdvancedFiltersModel;

  repositories = [
    { label: 'eurlex', value: 'eurlex' },
    { label: 'bookshop', value: 'bookshop' },
    { label: 'cordis', value: 'cordis' },
    { label: 'pubsy', value: 'pubsy' },
    { label: 'opendataportal', value: 'opendataportal' },
  ]


  public faTimesCircle = faTimesCircle;
  public faFilter = faFilter;
  saveFilters: Subject<void> = new Subject<void>();
  eurlexFilters: CorpusSearchPayload;


  cleanFilters: Subject<void> = new Subject<void>();
  advancedFiltersValues: AdvancedFiltersModel;

  get selectedRepositoryTypes() {
    return this.advancedFilters.get(`selectedRepositoryTypes`);
  }

  ngOnInit(): void {

    this.corpusCentral.eurlexFilters.subscribe((eurlexFilters: CorpusSearchPayload) => {
      this.eurlexFilters = new CorpusSearchPayload({ ...eurlexFilters });
    })

    this.corpusCentral.formMemory.subscribe((formMemory) => {
      this.formMemory = formMemory;
    })

    this.createForm();

    this.advancedFilters.valueChanges.subscribe((result: any) => {
      this.advancedFiltersValues = new AdvancedFiltersModel(
        {
          selectedRepositoryTypes: result.selectedRepositoryTypes,
          eurlexForm: { 
            eurlexMetadataFilters: result.eurlexMetadataFilters, 
            eurovocTreeNode: this.corpusCentral.eurovocTreeNode.getValue(),
            directoryTreeNode: this.corpusCentral.directoryTreeNode.getValue()
          }
        }
      )
    })
  }
  createForm() {
    let isPreviousFormPresent = false;
    if (this.formMemory && this.formMemory !== null) {
      isPreviousFormPresent = true;
    }

    if (isPreviousFormPresent) {
      const formM = this.formMemory
      this.advancedFilters = this.fb.group({
        selectedRepositoryTypes: [[...formM.selectedRepositoryTypes]],
      })
    } else {
      // ** Search terms and filters */
      this.advancedFilters = this.fb.group({
        selectedRepositoryTypes: [['eurlex']],
      })
    }
  }

  private setFormMemory(result: AdvancedFiltersModel) {
    this.corpusCentral.formMemory.next(result)
  }

  applyFilters() {
    // stop here if form is invalid
    if (this.advancedFilters.invalid) {
      return;
    }
    this.setFormMemory(this.advancedFiltersValues);
    this.corpusCentral.eurlexFilters.next(new CorpusSearchPayload({ ...this.eurlexFilters, source: this.advancedFiltersValues.selectedRepositoryTypes }));
    this.saveFilters.next()
    this.closeModal()
    this.activeModal.close('Close click');
  }

  closeModal() {
    this.activeModal.close()
  }

  constructor(private corpusCentral: CorpusCentralService, private fb: FormBuilder, public activeModal: NgbActiveModal) {
  }

  resetAdvancedFilters() {
    this.selectedRepositoryTypes.reset(['eurlex'])
    this.cleanFilters.next()

  }



}
