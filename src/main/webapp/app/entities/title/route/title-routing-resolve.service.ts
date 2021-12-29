import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITitle, Title } from '../title.model';
import { TitleService } from '../service/title.service';

@Injectable({ providedIn: 'root' })
export class TitleRoutingResolveService implements Resolve<ITitle> {
  constructor(protected service: TitleService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITitle> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((title: HttpResponse<Title>) => {
          if (title.body) {
            return of(title.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Title());
  }
}
