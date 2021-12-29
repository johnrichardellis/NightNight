import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITheme } from '../theme.model';
import { ThemeService } from '../service/theme.service';
import { ThemeDeleteDialogComponent } from '../delete/theme-delete-dialog.component';

@Component({
  selector: 'jhi-theme',
  templateUrl: './theme.component.html',
})
export class ThemeComponent implements OnInit {
  themes?: ITheme[];
  isLoading = false;

  constructor(protected themeService: ThemeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.themeService.query().subscribe(
      (res: HttpResponse<ITheme[]>) => {
        this.isLoading = false;
        this.themes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITheme): number {
    return item.id!;
  }

  delete(theme: ITheme): void {
    const modalRef = this.modalService.open(ThemeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.theme = theme;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
