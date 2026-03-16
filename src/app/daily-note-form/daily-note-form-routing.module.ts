import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyNoteFormPage } from './daily-note-form.page';

const routes: Routes = [
  {
    path: '',
    component: DailyNoteFormPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyNoteFormPageRoutingModule {}
