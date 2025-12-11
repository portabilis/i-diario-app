import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObservationDiaryPage } from './observation-diary.page';
import { ObservationFormPage } from './observation-form/observation-form.page';

const routes: Routes = [
  {
    path: '',
    component: ObservationDiaryPage,
  },
  {
    path: 'form',
    component: ObservationFormPage,
  },
  {
    path: 'form/:id',
    component: ObservationFormPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ObservationDiaryPageRoutingModule {}
