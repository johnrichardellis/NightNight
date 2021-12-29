jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITheme, Theme } from '../theme.model';
import { ThemeService } from '../service/theme.service';

import { ThemeRoutingResolveService } from './theme-routing-resolve.service';

describe('Theme routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ThemeRoutingResolveService;
  let service: ThemeService;
  let resultTheme: ITheme | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(ThemeRoutingResolveService);
    service = TestBed.inject(ThemeService);
    resultTheme = undefined;
  });

  describe('resolve', () => {
    it('should return ITheme returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTheme = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTheme).toEqual({ id: 123 });
    });

    it('should return new ITheme if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTheme = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultTheme).toEqual(new Theme());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Theme })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultTheme = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultTheme).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
