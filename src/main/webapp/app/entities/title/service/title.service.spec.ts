import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITitle, Title } from '../title.model';

import { TitleService } from './title.service';

describe('Title Service', () => {
  let service: TitleService;
  let httpMock: HttpTestingController;
  let elemDefault: ITitle;
  let expectedResult: ITitle | ITitle[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TitleService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      title: 'AAAAAAA',
      themes: 'AAAAAAA',
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

    it('should create a Title', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Title()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Title', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          themes: 'BBBBBB',
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

    it('should partial update a Title', () => {
      const patchObject = Object.assign(
        {
          themes: 'BBBBBB',
          link: 'BBBBBB',
        },
        new Title()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Title', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          title: 'BBBBBB',
          themes: 'BBBBBB',
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

    it('should delete a Title', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTitleToCollectionIfMissing', () => {
      it('should add a Title to an empty array', () => {
        const title: ITitle = { id: 123 };
        expectedResult = service.addTitleToCollectionIfMissing([], title);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(title);
      });

      it('should not add a Title to an array that contains it', () => {
        const title: ITitle = { id: 123 };
        const titleCollection: ITitle[] = [
          {
            ...title,
          },
          { id: 456 },
        ];
        expectedResult = service.addTitleToCollectionIfMissing(titleCollection, title);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Title to an array that doesn't contain it", () => {
        const title: ITitle = { id: 123 };
        const titleCollection: ITitle[] = [{ id: 456 }];
        expectedResult = service.addTitleToCollectionIfMissing(titleCollection, title);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(title);
      });

      it('should add only unique Title to an array', () => {
        const titleArray: ITitle[] = [{ id: 123 }, { id: 456 }, { id: 36765 }];
        const titleCollection: ITitle[] = [{ id: 123 }];
        expectedResult = service.addTitleToCollectionIfMissing(titleCollection, ...titleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const title: ITitle = { id: 123 };
        const title2: ITitle = { id: 456 };
        expectedResult = service.addTitleToCollectionIfMissing([], title, title2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(title);
        expect(expectedResult).toContain(title2);
      });

      it('should accept null and undefined values', () => {
        const title: ITitle = { id: 123 };
        expectedResult = service.addTitleToCollectionIfMissing([], null, title, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(title);
      });

      it('should return initial array if no Title is added', () => {
        const titleCollection: ITitle[] = [{ id: 123 }];
        expectedResult = service.addTitleToCollectionIfMissing(titleCollection, undefined, null);
        expect(expectedResult).toEqual(titleCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
