jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TitleService } from '../service/title.service';
import { ITitle, Title } from '../title.model';

import { TitleUpdateComponent } from './title-update.component';

describe('Title Management Update Component', () => {
  let comp: TitleUpdateComponent;
  let fixture: ComponentFixture<TitleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let titleService: TitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TitleUpdateComponent],
      providers: [FormBuilder, ActivatedRoute],
    })
      .overrideTemplate(TitleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TitleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    titleService = TestBed.inject(TitleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const title: ITitle = { id: 456 };

      activatedRoute.data = of({ title });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(title));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Title>>();
      const title = { id: 123 };
      jest.spyOn(titleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ title });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: title }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(titleService.update).toHaveBeenCalledWith(title);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Title>>();
      const title = new Title();
      jest.spyOn(titleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ title });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: title }));
      saveSubject.complete();

      // THEN
      expect(titleService.create).toHaveBeenCalledWith(title);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Title>>();
      const title = { id: 123 };
      jest.spyOn(titleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ title });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(titleService.update).toHaveBeenCalledWith(title);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
