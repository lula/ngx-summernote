# NgxSummernote

[Summernote](https://github.com/summernote/summernote) wysiwyg editor for Angular 6/7.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.

`projects` contains ngx-summernote lib (see Angular CLI libraries generation).

`src` contains an example application. Run `ng serve` to test.

## Installation

Install ngx-summernote and dependencies:

`npm install --save ngx-summernote summernote jquery`

## Editor

Add add JQuery and Summernote scripts and styles in angular.json file:

```json
"styles": [
  ...
  "node_modules/summernote/dist/summernote-lite.css"
],
"scripts": [
  ...
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/summernote/dist/summernote-lite.js"
]
```

Use `[ngxSummernote]` directive on an element to init Summernote editor:

```html
<div [ngxSummernote]></div>
```

Summernote is initialized with the following deafult config:

```javascript
{
  placeholder: '',
  tabsize: 2,
  height: 100,
  uploadImagePath: '',
  toolbar: [
      // [groupName, [list of button]]
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']]
  ],
  fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
}
```

You may also configure Summernote with your own summernote config:

```html
<div [ngxSummernote]="config"></div>
```

The provided config will be merged with the default one.

See Summernote available initialization options [here](https://summernote.org/deep-dive/#initialization-options).

## Viewer

Use `[ngxSummernoteView]` directive on an element to set innerHTML of an element:

```html
<div [ngxSummernoteView]="content"></div>
```

## Upload images to server instead of inserting Base64 in 

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
