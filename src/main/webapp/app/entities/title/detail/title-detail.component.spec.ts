import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TitleDetailComponent } from './title-detail.component';

describe('Title Management Detail Component', () => {
  let comp: TitleDetailComponent;
  let fixture: ComponentFixture<TitleDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TitleDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ title: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TitleDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TitleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load title on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.title).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
