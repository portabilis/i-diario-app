import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab6Page } from './tab6.page';

const routes: Routes = [
  {
    path: '',
    component: Tab6Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab6PageRoutingModule {}
