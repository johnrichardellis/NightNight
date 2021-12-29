import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITheme, getThemeIdentifier } from '../theme.model';

export type EntityResponseType = HttpResponse<ITheme>;
export type EntityArrayResponseType = HttpResponse<ITheme[]>;

@Injectable({ providedIn: 'root' })
export class ThemeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/themes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(theme: ITheme): Observable<EntityResponseType> {
    return this.http.post<ITheme>(this.resourceUrl, theme, { observe: 'response' });
  }

  update(theme: ITheme): Observable<EntityResponseType> {
    return this.http.put<ITheme>(`${this.resourceUrl}/${getThemeIdentifier(theme) as number}`, theme, { observe: 'response' });
  }

  partialUpdate(theme: ITheme): Observable<EntityResponseType> {
    return this.http.patch<ITheme>(`${this.resourceUrl}/${getThemeIdentifier(theme) as number}`, theme, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITheme>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITheme[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addThemeToCollectionIfMissing(themeCollection: ITheme[], ...themesToCheck: (ITheme | null | undefined)[]): ITheme[] {
    const themes: ITheme[] = themesToCheck.filter(isPresent);
    if (themes.length > 0) {
      const themeCollectionIdentifiers = themeCollection.map(themeItem => getThemeIdentifier(themeItem)!);
      const themesToAdd = themes.filter(themeItem => {
        const themeIdentifier = getThemeIdentifier(themeItem);
        if (themeIdentifier == null || themeCollectionIdentifiers.includes(themeIdentifier)) {
          return false;
        }
        themeCollectionIdentifiers.push(themeIdentifier);
        return true;
      });
      return [...themesToAdd, ...themeCollection];
    }
    return themeCollection;
  }
}
