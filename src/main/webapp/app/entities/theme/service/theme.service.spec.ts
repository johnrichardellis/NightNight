import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITheme, Theme } from '../theme.model';

import { ThemeService } from './theme.service';

describe('Theme Service', () => {
  let service: ThemeService;
  let httpMock: HttpTestingController;
  let elemDefault: ITheme;
  let expectedResult: ITheme | ITheme[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ThemeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      link: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Theme', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Theme()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Theme', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          link: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Theme', () => {
      const patchObject = Object.assign(
        {
          link: 'BBBBBB',
        },
        new Theme()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Theme', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          link: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Theme', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addThemeToCollectionIfMissing', () => {
      it('should add a Theme to an empty array', () => {
        const theme: ITheme = { id: 123 };
        expectedResult = service.addThemeToCollectionIfMissing([], theme);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(theme);
      });

      it('should not add a Theme to an array that contains it', () => {
        const theme: ITheme = { id: 123 };
        const themeCollection: ITheme[] = [
          {
            ...theme,
          },
          { id: 456 },
        ];
        expectedResult = service.addThemeToCollectionIfMissing(themeCollection, theme);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Theme to an array that doesn't contain it", () => {
        const theme: ITheme = { id: 123 };
        const themeCollection: ITheme[] = [{ id: 456 }];
        expectedResult = service.addThemeToCollectionIfMissing(themeCollection, theme);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(theme);
      });

      it('should add only unique Theme to an array', () => {
        const themeArray: ITheme[] = [{ id: 123 }, { id: 456 }, { id: 18078 }];
        const themeCollection: ITheme[] = [{ id: 123 }];
        expectedResult = service.addThemeToCollectionIfMissing(themeCollection, ...themeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const theme: ITheme = { id: 123 };
        const theme2: ITheme = { id: 456 };
        expectedResult = service.addThemeToCollectionIfMissing([], theme, theme2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(theme);
        expect(expectedResult).toContain(theme2);
      });

      it('should accept null and undefined values', () => {
        const theme: ITheme = { id: 123 };
        expectedResult = service.addThemeToCollectionIfMissing([], null, theme, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(theme);
      });

      it('should return initial array if no Theme is added', () => {
        const themeCollection: ITheme[] = [{ id: 123 }];
        expectedResult = service.addThemeToCollectionIfMissing(themeCollection, undefined, null);
        expect(expectedResult).toEqual(themeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
