import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DailyNoteFormPageRoutingModule } from './daily-note-form-routing.module';
import { DailyNoteFormPage } from './daily-note-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DailyNoteFormPageRoutingModule,
  ],
  declarations: [DailyNoteFormPage],
})
export class DailyNoteFormPageModule {}
