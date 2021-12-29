import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TitleService } from '../service/title.service';

import { TitleComponent } from './title.component';

describe('Title Management Component', () => {
  let comp: TitleComponent;
  let fixture: ComponentFixture<TitleComponent>;
  let service: TitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TitleComponent],
    })
      .overrideTemplate(TitleComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TitleComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TitleService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.titles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
