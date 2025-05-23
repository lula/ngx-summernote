import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxSummernoteModule } from 'ngx-summernote';

import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSummernoteModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
