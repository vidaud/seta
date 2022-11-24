import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: `app-corpus-findall-card`,
  templateUrl: `./corpus-findall-card.component.html`,
  styleUrls: [`./corpus-findall-card.component.scss`]
})
export class CorpusFindallCardComponent implements OnInit {
  faAngleDown = faAngleDown;

  constructor() { }

  @Input()
  word: string;


  ngOnInit() {
  }
}
