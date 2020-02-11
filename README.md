# NgxSummernote

[Summernote](https://github.com/summernote/summernote) editor for Angular :sunglasses:

## Installation

Install ngx-summernote and dependencies:

`npm install --save ngx-summernote summernote jquery`

Compatibility:

Angular | ngx-summernote
------- | --------------
9       | 0.7.x
8       | 0.7.x
7       | 0.6.x
6       | 0.5.4

## Editor

Add JQuery and Summernote scripts and styles in angular.json file:

```json
"styles": [
  ...
  "node_modules/summernote/dist/summernote-lite.min.css"
],
"scripts": [
  ...
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/summernote/dist/summernote-lite.min.js"
]
```

Use `[ngxSummernote]` directive on an element to init Summernote editor:

```html
<div [ngxSummernote]></div>
```

You may also configure Summernote with your own config:

```html
<div [ngxSummernote]="config"></div>
```

```typescript
export class AppComponent implements OnInit {
  ...
  config = {
    placeholder: '',
    tabsize: 2,
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
        ['misc', ['codeview', 'undo', 'redo']],
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
        ['fontsize', ['fontname', 'fontsize', 'color']],
        ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
        ['insert', ['table', 'picture', 'link', 'video', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  }
  ...
}
```

See Summernote available initialization options [here](https://summernote.org/deep-dive/#initialization-options).

## Viewer

Use `[ngxSummernoteView]` directive on an element to set innerHTML of an element:

```html
<div [ngxSummernoteView]="content"></div>
```

## Upload images to server instead of inserting Base64 in HTML

Use `uploadImagePath` option in config:

```javascipt
config = {
  uploadImagePath: 'http://example.com/upload' // API URL to upload image
};
```

API call response is expected to be like:

```javascript
{
  path: 'the path of the image' // http://example.com/image-path.png
}
```

If the reponse does not follow the above structure then the image is inserted as data URL.

To remove images from server when deleted from HTML, use `(mediaDelete)`:

```html
<div [ngxSummernote] (mediaDelete)="onDelete($event)"></div>
```

```typescript
onDelete(file) {
  deleteResource(file.url);
}
```

## Add custom button

In your component setup summernote `config` and code for the custom button, e.g.:

```typescript
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

export class AppComponent implements OnInit {
  config: any = {
    ...
    buttons: {
      'testBtn': customButton
    }
  };
  ...
}
```

## Development

To use the test application, first build the lib:

```
npm run build_lib
```

Then serve the test application and open it in your browser:

```
npm start
```



******** 

default config is now summernote's. Code block button (as other custom buttons in this lib) now has to be added in the component config.
