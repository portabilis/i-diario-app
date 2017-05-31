import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentsFrequencyPage } from './students-frequency';

@NgModule({
  declarations: [
    StudentsFrequencyPage,
  ],
  imports: [
    IonicPageModule.forChild(StudentsFrequencyPage),
  ],
  exports: [
    StudentsFrequencyPage
  ]
})
export class StudentsFrequencyModule {}
