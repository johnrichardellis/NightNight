import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITitle } from '../title.model';
import { TitleService } from '../service/title.service';

@Component({
  templateUrl: './title-delete-dialog.component.html',
})
export class TitleDeleteDialogComponent {
  title?: ITitle;

  constructor(protected titleService: TitleService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.titleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
