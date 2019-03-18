import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

declare var $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  
  form: FormGroup;

  config: any = {
    height: '200px',
      uploadImagePath: '/api/upload'
   };
  
  editorDisabled = false;

  wysiwygContent: string;

  get sanitizedHtml() {
    return this.sanitizer.bypassSecurityTrustHtml(this.form.get('html').value);
  }

  constructor(
    private sanitizer: DomSanitizer
  ) {
    this.form = new FormGroup({
      html: new FormControl()
    });
    this.wysiwygContent = '<p>Testing....</p>';
  }

  enableEditor() {
    this.editorDisabled = false;
  }

  disableEditor() {
    this.editorDisabled = true;
  }

  onBlur() {
    console.log('Blur');
  }
}
