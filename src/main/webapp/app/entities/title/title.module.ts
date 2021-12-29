import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TitleComponent } from './list/title.component';
import { TitleDetailComponent } from './detail/title-detail.component';
import { TitleUpdateComponent } from './update/title-update.component';
import { TitleDeleteDialogComponent } from './delete/title-delete-dialog.component';
import { TitleRoutingModule } from './route/title-routing.module';

@NgModule({
  imports: [SharedModule, TitleRoutingModule],
  declarations: [TitleComponent, TitleDetailComponent, TitleUpdateComponent, TitleDeleteDialogComponent],
  entryComponents: [TitleDeleteDialogComponent],
})
export class TitleModule {}
