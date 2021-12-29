import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ThemeService } from '../service/theme.service';

import { ThemeComponent } from './theme.component';

describe('Theme Management Component', () => {
  let comp: ThemeComponent;
  let fixture: ComponentFixture<ThemeComponent>;
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ThemeComponent],
    })
      .overrideTemplate(ThemeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ThemeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ThemeService);

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
    expect(comp.themes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
