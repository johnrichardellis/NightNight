import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'title',
        data: { pageTitle: 'nightnightApp.title.home.title' },
        loadChildren: () => import('./title/title.module').then(m => m.TitleModule),
      },
      {
        path: 'theme',
        data: { pageTitle: 'nightnightApp.theme.home.title' },
        loadChildren: () => import('./theme/theme.module').then(m => m.ThemeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
