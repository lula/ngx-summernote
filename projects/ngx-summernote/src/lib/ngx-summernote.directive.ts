import { HttpClient } from '@angular/common/http';
import {
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { SummernoteOptions } from './summernote-options';
import { codeBlockButton } from './code-block.button';
import { NGX_SUMMERNOTE_CONFIG } from './ngx-summernote.config';

declare var $;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[ngxSummernote]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxSummernoteDirective),
      multi: true
    }
  ]
})
export class NgxSummernoteDirective
  implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  @Input() set ngxSummernote(options: SummernoteOptions) {
    if (options) {
      this.setOptionsFromConfig(options);
    }
  }

  // summernoteModel directive as input: store initial editor content
  @Input() set summernoteModel(content: any) {
    this.updateEditor(content);
  }

  // summernoteModel directive as output: update model if editor contentChanged
  @Output() summernoteModelChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() imageUpload: EventEmitter<any> = new EventEmitter<any>();
  @Output() mediaDelete: EventEmitter<any> = new EventEmitter<any>();

  // // summernoteInit directive as output: send manual editor initialization
  // @Output() summernoteInit: EventEmitter<Object> = new EventEmitter<Object>();

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();

  @Input() ngxSummernoteDisabled: boolean;

  private _options: SummernoteOptions = {};

  private SPECIAL_TAGS: string[] = ['img', 'button', 'input', 'a'];
  private INNER_HTML_ATTR = 'innerHTML';
  private _hasSpecialTag: boolean;
  private _$element: any; // jquery wrapped element
  private _editor: any; // editor element
  private _model: string;
  private _oldModel: string = null;
  private _editorInitialized: boolean;

  private uploadSub: Subscription;

  constructor(
    private el: ElementRef,
    private zone: NgZone,
    private http: HttpClient,
    @Optional() @Inject(NGX_SUMMERNOTE_CONFIG) private summerNoteOptions: SummernoteOptions
  ) {
    const element: any = el.nativeElement;

    // check if the element is a special tag
    if (this.SPECIAL_TAGS.indexOf(element.tagName.toLowerCase()) !== -1) {
      this._hasSpecialTag = true;
    }

    // jquery wrap and store element

    // this._$element = <any>$(element);

    this.zone = zone;

    if (this.summerNoteOptions) {
      this.setOptionsFromConfig(this.summerNoteOptions);
    }
  }

  ngOnInit() {
    this.createEditor();
  }

  ngOnChanges(changes) {
    if (this._editorInitialized && changes) {
      if (
        changes.ngxSummernoteDisabled &&
        !changes.ngxSummernoteDisabled.firstChange &&
        changes.ngxSummernoteDisabled.currentValue !==
        changes.ngxSummernoteDisabled.previousValue
      ) {
        if (changes.ngxSummernoteDisabled.currentValue) {
          this._$element.summernote('disable');
        } else {
          this._$element.summernote('enable');
        }
      }
    }
  }

  ngOnDestroy() {
    this.destroyEditor();
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
  }

  // Begin ControlValueAccesor methods.
  onChange = (_: any) => { };
  onTouched = () => { };

  // Form model content changed.
  writeValue(content: any): void {
    this.updateEditor(content);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Update editor with model contents.
  private updateEditor(content: any) {
    if (JSON.stringify(this._oldModel) === JSON.stringify(content)) {
      return;
    }

    this._oldModel = content;
    // this._$element.html(content);

    if (this._editorInitialized) {
      this._$element ? this._$element.summernote('code', content) : undefined;
    } else {
      this._$element ? this._$element.html(content) : undefined;
    }
  }

  // update model if editor contentChanged
  private updateModel(content?: any) {
    // console.log('update model', content)
    this.zone.run(() => {
      let modelContent: any = null;

      if (this._hasSpecialTag) {
        const attributeNodes = this._$element[0].attributes;
        const attrs = {};

        for (let i = 0; i < attributeNodes.length; i++) {
          const attrName = attributeNodes[i].name;
          if (
            this._options.angularIgnoreAttrs &&
            this._options.angularIgnoreAttrs.indexOf(attrName) !== -1
          ) {
            continue;
          }
          attrs[attrName] = attributeNodes[i].value;
        }

        if (this._$element[0].innerHTML) {
          attrs[this.INNER_HTML_ATTR] = this._$element[0].innerHTML;
        }

        modelContent = attrs;
      } else {
        const returnedHtml: any = content || '';
        if (typeof returnedHtml === 'string') {
          modelContent = returnedHtml;
        }
      }
      if (this._oldModel !== modelContent) {
        this._oldModel = modelContent;
        // Update summernoteModel
        this.summernoteModelChange.emit(modelContent);
        // Update form model.
        this.onChange(content);
      }
    });
  }

  private initListeners() {
    const self = this;

    if (!this._$element) {
      return;
    }

    this._$element.on('summernote.init', function () {
      setTimeout(function() {
        self.updateModel();
      }, 0);
    });

    this._$element.on('summernote.change', function (
      event,
      contents,
      $editable
    ) {
      setTimeout(function() {
        self.updateModel(contents);
      }, 0);
    });

    this._$element.on('summernote.blur', function() {
      setTimeout(function() {
        self.onTouched();
        self.blur.emit();
      }, 0);
    });

    if (this._options.immediateAngularModelUpdate) {
      this._editor.on('keyup', function() {
        setTimeout(function() {
          self.updateModel();
        }, 0);
      });
    }
  }

  private createEditor() {
    if (this._editorInitialized) {
      return;
    }

    this.setContent(true);

    const wait = 50;
    // this.initListeners(); // issue #31
    try {
      this._$element = <any>$(this.el.nativeElement);
    } catch (error) {
      console.log(`JQuery seems not te loaded yet! Wait ${wait}ms and try again`);
    }

    if (!this._$element) {
      setTimeout(() => {
        this.createEditor();
      }, wait);
    } else {
      // init editor
      this.zone.runOutsideAngular(() => {
        this._editor = this._$element
          .summernote(this._options)
          .data('summernote').$note;

        this.initListeners(); // issue #31

        if (this.ngxSummernoteDisabled) {
          this._$element.summernote('disable');
        }
      });
      this._editorInitialized = true;
    }
  }

  private setHtml() {
    this._$element.summernote('code', this._model || '', true);
  }

  private setContent(firstTime = false) {
    // console.log('set content', firstTime, this._oldModel, this._model)
    const self = this;
    // Set initial content
    if (this._model || this._model === '') {
      this._oldModel = this._model;
      if (this._hasSpecialTag) {
        const tags: Object = this._model;
        // add tags on element
        if (tags) {
          for (const attr in tags) {
            if (tags.hasOwnProperty(attr) && attr !== this.INNER_HTML_ATTR) {
              this._$element.attr(attr, tags[attr]);
            }
          }

          if (tags.hasOwnProperty(this.INNER_HTML_ATTR)) {
            this._$element[0].innerHTML = tags[this.INNER_HTML_ATTR];
          }
        }
      } else {
        self.setHtml();
      }
    }
  }

  private destroyEditor() {
    if (this._editorInitialized) {
      this._editor.off('keyup');
      this._$element.summernote('destroy'); // TODO not sure it works now...
      this._editorInitialized = false;
    }
  }

  // private getEditor() {
  //   if (this._$element) {
  //     return this._$element.summernote.bind(this._$element);
  //   }

  //   return null;
  // }

  private async uploadImage(files) {
    if (this._options.uploadImagePath) {
      this.imageUpload.emit({ uploading: true });

      const requests = [];
      for (const file of files) {
        const data = new FormData();
        data.append('image', file);
        const obs = this.http
          .post(this._options.uploadImagePath, data, this._options.uploadImageRequestOptions)
          .pipe(
            map(
              (response: { path: string }) =>
                response && typeof response.path === 'string' && response.path
            )
          );
        requests.push(obs);
      }

      this.uploadSub = combineLatest(requests).subscribe(
        (remotePaths: string[]) => {
          for (const remotePath of remotePaths) {
            this._$element.summernote('insertImage', remotePath);
          }
          this.imageUpload.emit({ uploading: false });
        },
        err => this.insertFromDataURL(files)
      );
    } else {
      this.insertFromDataURL(files);
    }
  }

  insertFromDataURL(files) {
    for (const file of files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this._$element.summernote('insertImage', reader.result);
        this.imageUpload.emit({ uploading: false, encoding: 'base64' });
      };
      reader.onerror = error => console.error(error);
    }
  }

  /**
   * Initialize the editor options with the provided summernote config.
   */
  private setOptionsFromConfig(options: SummernoteOptions) {
    if (!options.buttons) {
      options.buttons = {};
    }

    options.callbacks = {
      ...options.callbacks,
      onImageUpload: files => this.uploadImage(files),
      onMediaDelete: files =>
        this.mediaDelete.emit({ url: $(files[0]).attr('src') })
    };

    // add custom buttons
    options.buttons.codeBlock = codeBlockButton;

    Object.assign(this._options, options);
  }
}
