import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentsFrequencyEditPage } from './students-frequency-edit';

@NgModule({
  declarations: [
    StudentsFrequencyEditPage,
  ],
  imports: [
    IonicPageModule.forChild(StudentsFrequencyEditPage),
  ],
  exports: [
    StudentsFrequencyEditPage
  ]
})
export class StudentsFrequencyEditModule {}
