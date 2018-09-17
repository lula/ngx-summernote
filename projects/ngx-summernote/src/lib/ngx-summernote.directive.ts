import {
    Directive, ElementRef, Input, Output,
    EventEmitter, forwardRef, NgZone, OnInit, OnDestroy, OnChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var $;

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[ngxSummernote], [ngxSummernoteDisabled]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NgxSummernoteDirective),
        multi: true
    }]
})
export class NgxSummernoteDirective implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
    @Input() set ngxSummernote(options: any) {
        this._options = Object.assign(this._options, options);
    }
    // summernoteModel directive as input: store initial editor content
    @Input() set summernoteModel(content: any) {
        this.updateEditor(content);
    }

    // summernoteModel directive as output: update model if editor contentChanged
    @Output() summernoteModelChange: EventEmitter<any> = new EventEmitter<any>();

    // summernoteInit directive as output: send manual editor initialization
    @Output() summernoteInit: EventEmitter<Object> = new EventEmitter<Object>();

    @Input() ngxSummernoteDisabled: boolean;

    private _options: any = {
        immediateAngularModelUpdate: false,
        angularIgnoreAttrs: null,
        placeholder: '',
        tabsize: 2,
        height: 100,
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
    };

    private SPECIAL_TAGS: string[] = ['img', 'button', 'input', 'a'];
    private INNER_HTML_ATTR = 'innerHTML';
    private _hasSpecialTag: boolean;
    private _$element: any; // jquery wrapped element
    private _editor: any; // editor element
    private _model: string;
    private _oldModel: string = null;
    private _editorInitialized: boolean;

    constructor(el: ElementRef, private zone: NgZone) {
        const element: any = el.nativeElement;

        // check if the element is a special tag
        if (this.SPECIAL_TAGS.indexOf(element.tagName.toLowerCase()) !== -1) {
            this._hasSpecialTag = true;
        }

        // jquery wrap and store element
        this._$element = (<any>$(element));
        this.zone = zone;
    }

    ngOnInit() {
        // check if output summernoteInit is present. Maybe observers is private and
        // should not be used?? TODO how to better test that an output directive is present.
        if (!this.summernoteInit.observers.length) {
            this.createEditor();
        } else {
            // TODO not sure it works now...
            this.generateManualController();
        }
    }

    ngOnChanges(changes) {
        if (this._editorInitialized && changes) {
            if (changes.ngxSummernoteDisabled && !changes.ngxSummernoteDisabled.firstChange &&
                changes.ngxSummernoteDisabled.currentValue !== changes.ngxSummernoteDisabled.previousValue) {
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
    }

    // Begin ControlValueAccesor methods.
    onChange = (_) => { };
    onTouched = () => { };

    // Form model content changed.
    writeValue(content: any): void {
        this.updateEditor(content);
    }

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    // Update editor with model contents.
    private updateEditor(content: any) {
        if (JSON.stringify(this._oldModel) === JSON.stringify(content)) {
            return;
        }

        this._oldModel = content;
        this._$element.html(content);

        if (this._editorInitialized) {
            this._$element.summernote('code', content);
        } else {
            this._$element.html(content);
        }
    }

    // update model if editor contentChanged
    private updateModel(content?: any) {
        this.zone.run(() => {
            let modelContent: any = null;

            if (this._hasSpecialTag) {
                const attributeNodes = this._$element[0].attributes;
                const attrs = {};

                for (let i = 0; i < attributeNodes.length; i++) {
                    const attrName = attributeNodes[i].name;
                    if (this._options.angularIgnoreAttrs && this._options.angularIgnoreAttrs.indexOf(attrName) !== -1) {
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
            this._oldModel = modelContent;
            // Update summernoteModel
            this.summernoteModelChange.emit(modelContent);
            // Update form model.
            this.onChange(content);
        });
    }

    private initListeners() {
        const self = this;

        if (!this._$element) { return; }

        this._$element.on('summernote.init', function () {
            setTimeout(function () {
                self.updateModel();
            }, 0);
        });

        this._$element.on('summernote.change', function (event, contents, $editable) {
            setTimeout(function () {
                self.updateModel(contents);
            }, 0);
        });

        if (this._options.immediateAngularModelUpdate) {
            this._editor.on('keyup', function () {
                setTimeout(function () {
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

        this.initListeners();

        // init editor
        this.zone.runOutsideAngular(() => {
            this._editor = this._$element.summernote(this._options).data('summernote').$note;
            if (this.ngxSummernoteDisabled) {
                this._$element.summernote('disable');
            }
        });

        this._editorInitialized = true;
    }

    private setHtml() {
        this._$element.summernote('code', this._model || '', true);
    }

    private setContent(firstTime = false) {
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

    private getEditor() {
        if (this._$element) {
            return this._$element.summernote.bind(this._$element);
        }

        return null;
    }

    // send manual editor initialization
    // TODO not sure it works now...
    private generateManualController() {
        const self = this;
        const controls = {
            initialize: this.createEditor.bind(this),
            destroy: this.destroyEditor.bind(this),
            getEditor: this.getEditor.bind(this),
        };
        this.summernoteInit.emit(controls);
    }
}
