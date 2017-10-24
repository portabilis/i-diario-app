import { NgModule } from '@angular/core';
import { CapitalizePipe } from './../pipes/capitalize.pipe';
import { ArraySortPipe } from './../pipes/sort.pipe';

@NgModule({
  declarations: [
    CapitalizePipe,
    ArraySortPipe
  ],
  exports: [
    CapitalizePipe,
    ArraySortPipe
  ],
})
export class AppPipesModule {}
