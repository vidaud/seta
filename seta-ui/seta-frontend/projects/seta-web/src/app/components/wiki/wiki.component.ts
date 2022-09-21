import { Component, Input, OnInit } from '@angular/core';
import { faWikipediaW } from '@fortawesome/free-brands-svg-icons';
import { faAngleDown, faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';
import { Actions, ofActionDispatched, ofActionSuccessful, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SetaDocument } from '../../models/document.model';
import { WikiSearch } from '../../store/seta.actions';
import { SetaState } from '../../store/seta.state';

@Component({
  selector: `app-wiki`,
  templateUrl: `./wiki.component.html`,
  styleUrls: [`./wiki.component.scss`]
})
export class WikiComponent implements OnInit {


  faWikipediaW = faWikipediaW;
  faAngleDown = faAngleDown;
  faExternalLinkSquareAlt = faExternalLinkSquareAlt;

  @Select(SetaState.wikiDocuments)
  wikiDocuments$: Observable<SetaDocument[]>;

  constructor(private actions$: Actions) {
  }

  goToWiki(link: string) {
    window.open(`https://en.wikipedia.org/wiki/${link}`, `_blank`);
  }

  ngOnInit() {}
}
