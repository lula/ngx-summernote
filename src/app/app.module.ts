import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSummernoteModule, provideNgxSummerNodeConfig, SummernoteOptions } from 'ngx-summernote';

declare var $;

function customButton(context) {
  const ui = $.summernote.ui;
  const button = ui.button({
    contents: '<i class="note-icon-magic"></i> Hello',
    tooltip: 'Custom button',
    container: '.note-editor',
    className: 'note-btn',
    click: function() {
      context.invoke('editor.insertText', 'Hello from test btn!!!');
    }
  });
  return button.render();
}

const ngxSummerNoteConfig: SummernoteOptions = {
  airMode: false,
  popover: {
    table: [
      ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
      ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
    ],
    image: [
      ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
      ['float', ['floatLeft', 'floatRight', 'floatNone']],
      ['remove', ['removeMedia']]
    ],
    link: [['link', ['linkDialogShow', 'unlink']]],
    air: [
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear'
        ]
      ]
    ]
  },
  height: 200,
  uploadImagePath: '/api/upload',
  toolbar: [
    ['misc', ['codeview', 'undo', 'redo', 'codeBlock']],
    [
      'font',
      [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'superscript',
        'subscript',
        'clear'
      ]
    ],
    ['fontsize', ['fontname', 'fontsize', 'color']],
    ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
    ['insert', ['table', 'picture', 'link', 'video', 'hr']],
    ['customButtons', ['testBtn']]
  ],
  buttons: {
    testBtn: customButton
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSummernoteModule,
    HttpClientModule
  ],
  providers: [
    // Provide global config either using
    // 1) The token 'NGX_SUMMERNOTE_CONFIG'
    // {
    //   provide: NGX_SUMMERNOTE_CONFIG,
    //   useFactory: ngxSummerNoteConfigFactory,
    // }
    // 2) The function 'provideNgxSummerNodeConfig'
    provideNgxSummerNodeConfig(ngxSummerNoteConfig)
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
