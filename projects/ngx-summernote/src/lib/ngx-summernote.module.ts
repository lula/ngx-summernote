import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxSummernoteDirective } from './ngx-summernote.directive';

@NgModule({
  declarations: [
    NgxSummernoteDirective
  ],
  exports: [
    NgxSummernoteDirective
  ]
})
export class NgxSummernoteModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: NgxSummernoteModule, providers: []};
  }
}
