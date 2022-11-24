import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Select, Store } from '@ngxs/store';
import { environment } from 'projects/seta-web/src/environments/environment';
import { Observable } from 'rxjs';
import { MainSearch } from '../../store/seta.actions';
import { SetaState } from '../../store/seta.state';

@Component({
  selector: `app-find-all`,
  templateUrl: `./find-all.component.html`,
  styleUrls: [`./find-all.component.scss`]
})
export class FindAllComponent implements OnInit {
  regex = environment._regex;

  @Select(SetaState.term)
  term$: Observable<string>;

  term: string;

  word: string;

  faSearch = faSearch;
  activeGraph = `force`;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.term$.subscribe((term) => (this.term = term));
  }

  fireGraph(graph: string) {
    this.activeGraph = graph;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get(`word`)) {
        this.word = params.get(`word`).replace(this.regex, ` `);
      } else if (this.term) {
        this.word = this.term;
      } else {
        this.word = `green deal`;
      }
      this.store.dispatch(new MainSearch(this.word));
    });
  }
}
