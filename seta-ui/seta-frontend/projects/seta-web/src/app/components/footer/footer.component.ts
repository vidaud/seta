import { Component, OnInit } from '@angular/core';

@Component({
  selector: `app-footer`,
  templateUrl: `./footer.component.html`,
  styleUrls: [`./footer.component.scss`]
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  goToLink(event: any, link: string) {
    window.open(`${link}`, `_blank`);
    event.preventDefault();
  }

}
