import { NgModule } from '@angular/core';
import { TooltipComponent } from './tooltip/tooltip';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [
		TooltipComponent,
	],
	imports: [
		IonicModule.forRoot(TooltipComponent)
	],
	exports: [TooltipComponent]
})
export class ComponentsModule {}
