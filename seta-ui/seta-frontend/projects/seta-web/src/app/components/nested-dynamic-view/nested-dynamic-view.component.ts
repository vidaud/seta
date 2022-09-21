import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';
import { SetaElement } from '../../models/document.model';

@Component({
  selector: 'app-nested-dynamic-view',
  template: `
    <ng-container
      [ngTemplateOutlet]="itemTemplate"
      [ngTemplateOutletContext]="{ $implicit: data }"
    >
    </ng-container>
  `,
  styleUrls: ['./nested-dynamic-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NestedDynamicViewComponent implements OnInit {
  @Input() data: SetaElement;
  @Input() itemTemplate: TemplateRef<HTMLElement>;
  constructor() { }

  ngOnInit() {
  }

}
