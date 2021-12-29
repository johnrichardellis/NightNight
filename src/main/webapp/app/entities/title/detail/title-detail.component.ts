import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITitle } from '../title.model';

@Component({
  selector: 'jhi-title-detail',
  templateUrl: './title-detail.component.html',
})
export class TitleDetailComponent implements OnInit {
  title: ITitle | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ title }) => {
      this.title = title;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
