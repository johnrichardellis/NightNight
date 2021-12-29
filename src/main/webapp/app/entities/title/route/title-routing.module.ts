import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TitleComponent } from '../list/title.component';
import { TitleDetailComponent } from '../detail/title-detail.component';
import { TitleUpdateComponent } from '../update/title-update.component';
import { TitleRoutingResolveService } from './title-routing-resolve.service';

const titleRoute: Routes = [
  {
    path: '',
    component: TitleComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TitleDetailComponent,
    resolve: {
      title: TitleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TitleUpdateComponent,
    resolve: {
      title: TitleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TitleUpdateComponent,
    resolve: {
      title: TitleRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(titleRoute)],
  exports: [RouterModule],
})
export class TitleRoutingModule {}
