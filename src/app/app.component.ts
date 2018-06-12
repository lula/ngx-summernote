import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  form: FormGroup;
  config = {
    height: '200px'
  };

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.form.get('html').value);
  }

  constructor(
    private sanitizer: DomSanitizer
  ) {
    this.form = new FormGroup({
      html: new FormControl('Hello! This is an <strong>initial</strong> html content')
    });
  }
}
