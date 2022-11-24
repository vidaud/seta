import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Actions, ofActionDispatched, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Vertex } from '../../models/vertex.model';
import { MainSearch, SimilarSearch } from '../../store/seta.actions';
import { SetaState } from '../../store/seta.state';

@Component({
  selector: `app-similar`,
  templateUrl: `./similar.component.html`,
  styleUrls: [`./similar.component.scss`]
})
export class SimilarComponent implements OnInit {


  faAngleDown = faAngleDown;
  faSearch = faSearch;

  @Select(SetaState.vertexes)
  vertexes$: Observable<Vertex[]>;


  constructor(private store: Store, private actions$: Actions) {
  }

  similar(term: string) {
    this.store.dispatch(new MainSearch(term));
  }

  ngOnInit() {
  }
}
