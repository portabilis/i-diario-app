import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab6Page } from './tab6.page';
import { Tab6PageRoutingModule } from './tab6-routing.module';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, Tab6PageRoutingModule],
  declarations: [Tab6Page],
})
export class Tab6PageModule {}
