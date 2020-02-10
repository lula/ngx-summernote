import {
    Directive, Input, ElementRef, Renderer2, AfterViewInit
} from '@angular/core';

declare var $;

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[ngxSummernoteView]'
})
export class NgxSummernoteViewDirective implements AfterViewInit {
    @Input() set ngxSummernoteView(content: string) {
        this._element.innerHTML = content || '';
    }

    private _element: any;

    constructor(
        private renderer2: Renderer2,
        element: ElementRef
    ) {
        this._element = element.nativeElement;
    }

    ngAfterViewInit() {
        this.renderer2.addClass(this._element, 'ngx-summernote-view');
    }
}
