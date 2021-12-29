import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITheme } from '../theme.model';
import { ThemeService } from '../service/theme.service';

@Component({
  templateUrl: './theme-delete-dialog.component.html',
})
export class ThemeDeleteDialogComponent {
  theme?: ITheme;

  constructor(protected themeService: ThemeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.themeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
