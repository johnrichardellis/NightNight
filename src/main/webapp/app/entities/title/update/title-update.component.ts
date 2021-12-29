import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITitle, Title } from '../title.model';
import { TitleService } from '../service/title.service';

@Component({
  selector: 'jhi-title-update',
  templateUrl: './title-update.component.html',
})
export class TitleUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [],
    themes: [],
    link: [],
  });

  constructor(protected titleService: TitleService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ title }) => {
      this.updateForm(title);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const title = this.createFromForm();
    if (title.id !== undefined) {
      this.subscribeToSaveResponse(this.titleService.update(title));
    } else {
      this.subscribeToSaveResponse(this.titleService.create(title));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITitle>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(title: ITitle): void {
    this.editForm.patchValue({
      id: title.id,
      title: title.title,
      themes: title.themes,
      link: title.link,
    });
  }

  protected createFromForm(): ITitle {
    return {
      ...new Title(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      themes: this.editForm.get(['themes'])!.value,
      link: this.editForm.get(['link'])!.value,
    };
  }
}
