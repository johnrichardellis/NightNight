import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITitle } from '../title.model';
import { TitleService } from '../service/title.service';
import { TitleDeleteDialogComponent } from '../delete/title-delete-dialog.component';

@Component({
  selector: 'jhi-title',
  templateUrl: './title.component.html',
})
export class TitleComponent implements OnInit {
  titles?: ITitle[];
  isLoading = false;

  constructor(protected titleService: TitleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.titleService.query().subscribe(
      (res: HttpResponse<ITitle[]>) => {
        this.isLoading = false;
        this.titles = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITitle): number {
    return item.id!;
  }

  delete(title: ITitle): void {
    const modalRef = this.modalService.open(TitleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = title;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
