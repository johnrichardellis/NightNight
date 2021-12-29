import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITitle, getTitleIdentifier } from '../title.model';

export type EntityResponseType = HttpResponse<ITitle>;
export type EntityArrayResponseType = HttpResponse<ITitle[]>;

@Injectable({ providedIn: 'root' })
export class TitleService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/titles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(title: ITitle): Observable<EntityResponseType> {
    return this.http.post<ITitle>(this.resourceUrl, title, { observe: 'response' });
  }

  update(title: ITitle): Observable<EntityResponseType> {
    return this.http.put<ITitle>(`${this.resourceUrl}/${getTitleIdentifier(title) as number}`, title, { observe: 'response' });
  }

  partialUpdate(title: ITitle): Observable<EntityResponseType> {
    return this.http.patch<ITitle>(`${this.resourceUrl}/${getTitleIdentifier(title) as number}`, title, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITitle>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITitle[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTitleToCollectionIfMissing(titleCollection: ITitle[], ...titlesToCheck: (ITitle | null | undefined)[]): ITitle[] {
    const titles: ITitle[] = titlesToCheck.filter(isPresent);
    if (titles.length > 0) {
      const titleCollectionIdentifiers = titleCollection.map(titleItem => getTitleIdentifier(titleItem)!);
      const titlesToAdd = titles.filter(titleItem => {
        const titleIdentifier = getTitleIdentifier(titleItem);
        if (titleIdentifier == null || titleCollectionIdentifiers.includes(titleIdentifier)) {
          return false;
        }
        titleCollectionIdentifiers.push(titleIdentifier);
        return true;
      });
      return [...titlesToAdd, ...titleCollection];
    }
    return titleCollection;
  }
}
