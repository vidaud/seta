import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: `ngbd-modal-copy`,
  template: ` <div class="modal-header">
                <h4 class="modal-title">Rsa Private Key</h4>
                <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
                   <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <p>Store this key in a safe way</p>
                <div class="mydivouter">
                  <button class="mybuttonoverlap btn btn-light" type="button" (click)="copyToClipboard(key)">
                    <ng-container *ngIf="actualButtonText === 'copy'; else second">
                    copy
                    </ng-container>
                    <ng-template #second>
                    copied!!
                    </ng-template>
                  </button>
                  <code>
                    {{key}}
                  </code>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
              </div>`,
  styles: [`.mydivouter {position: relative;}`
          ,`.mybuttonoverlap {
           position: relative;
           z-index: 1;
           top: 44px;
           opacity: 0;
           margin-left: 90%;
           box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}`
          , `.mybuttonoverlapShown {opacity: 1;}`
          , `.mydivouter:hover .mybuttonoverlap {opacity: 1;}`
          ]
})
export class NgbdModalCopy implements OnInit {
  @Input() key;

  buttonPosibleTexts = ["copy", "copied!"]


  actualButtonText = this.buttonPosibleTexts[0]
  isActualButtonTextVisible = true

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  public copyToClipboard(data: string) {
    /* Copy the text */
    navigator.clipboard.writeText(data);
    this.actualButtonText = this.buttonPosibleTexts[1]
    setTimeout(() => {
      this.actualButtonText = this.buttonPosibleTexts[0]
    }, 3000);
  }

}

@Component({
  selector: `ngbd-modal-confirm`,
  template: `<div class="modal-header">
    <h4 class="modal-title" id="modal-title">Profile deletion</h4>
    <button type="button" class="close" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <p><strong>Are you sure you want to delete <span style="font-weight: bold;">"{{username}}"</span> profile?</strong></p>
    <p>All information associated to this user profile in SeTA databases will be permanently deleted.
    <span class="text-danger">This operation can not be undone. The data might persist in archives but not longer than a
    month</span>
    </p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
    <button type="button" class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
  </div>`
})
export class NgbdModalConfirm {
  @Input() username;
  constructor(public modal: NgbActiveModal) { }
}
