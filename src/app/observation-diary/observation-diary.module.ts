import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ObservationDiaryPage } from './observation-diary.page';
import { ObservationFormPage } from './observation-form/observation-form.page';
import { ObservationDiaryPageRoutingModule } from './observation-diary-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ObservationDiaryPageRoutingModule,
  ],
  declarations: [ObservationDiaryPage, ObservationFormPage],
})
export class ObservationDiaryPageModule {}
