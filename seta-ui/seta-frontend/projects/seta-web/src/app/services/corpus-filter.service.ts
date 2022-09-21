import { Injectable } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject } from 'rxjs';
import { ActCategoryDto, SubjectType } from '../models/eurlexMetadataDto.model';

export class DatePickerFilter {
  public fromDate: NgbDate;
  public toDate: NgbDate;

  constructor(data?: Partial<DatePickerFilter>) {
    Object.assign(this, data);
  }
}

export class CorpusFilterDatatable {
  public datePicker: DatePickerFilter;
  public subjects: string;
  public actCategories: ActCategoryDto;

  constructor(data?: Partial<CorpusFilterDatatable>) {
    Object.assign(this, data);
  }
}

@Injectable({
  providedIn: `root`,
})
export class CorpusFilterService {

  public corpusFormSubject$ = new BehaviorSubject<CorpusFilterDatatable>(null);

  constructor() {
  }

}
