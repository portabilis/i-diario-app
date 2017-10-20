import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentsFrequencyEditPage } from './students-frequency-edit';
import { AppPipesModule } from '../../pipes/app-pipes.module';

@NgModule({
  declarations: [
    StudentsFrequencyEditPage,
  ],
  imports: [
    IonicPageModule.forChild(StudentsFrequencyEditPage),
    AppPipesModule,
  ],
  exports: [
    StudentsFrequencyEditPage
  ]
})
export class StudentsFrequencyEditModule {}
