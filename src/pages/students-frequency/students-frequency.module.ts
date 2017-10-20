import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentsFrequencyPage } from './students-frequency';
import { AppPipesModule } from '../../pipes/app-pipes.module';

@NgModule({
  declarations: [
    StudentsFrequencyPage,
  ],
  imports: [
    IonicPageModule.forChild(StudentsFrequencyPage),
    AppPipesModule,
  ],
  exports: [
    StudentsFrequencyPage
  ]
})
export class StudentsFrequencyModule {}
