import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType, SortType } from '@swimlane/ngx-datatable';
import { MongoQueryModel } from '../../models/mongo-query.model';

@Component({
  selector: 'app-my-searches',
  templateUrl: './my-searches.component.html',
  styleUrls: ['./my-searches.component.scss']
})
export class MySearchesComponent implements OnInit {

  public rows: MongoQueryModel[] = [];
  public temp: MongoQueryModel[] = [];

  constructor(
  ) { }

  @ViewChild(DatatableComponent)
  public table: DatatableComponent;

  public ColumnMode = ColumnMode;
  public SortType = SortType;
  public SelectionType = SelectionType;

  ngOnInit(): void {

  }


}
