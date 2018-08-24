import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TooltipComponent } from './tooltip';

@NgModule({
  declarations: [
    TooltipComponent,
   ],
  imports: [
    IonicModule,
  ],
  exports: [
    TooltipComponent
  ],
  entryComponents:[
    TooltipComponent
  ]
})
export class TooltipComponentModule {}