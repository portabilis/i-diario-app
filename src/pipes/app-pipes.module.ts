import { NgModule } from '@angular/core';
import { CapitalizePipe } from './../pipes/capitalize.pipe';

@NgModule({
  declarations: [
    CapitalizePipe
  ],
  exports: [
    CapitalizePipe
  ],
})
export class AppPipesModule {}
