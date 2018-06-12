import {
    Directive, Input, ElementRef, Renderer, AfterViewInit
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
        private renderer: Renderer,
        element: ElementRef
    ) {
        this._element = element.nativeElement;
    }

    ngAfterViewInit() {
        this.renderer.setElementClass(this._element, 'ngx-summernote-view', true);
    }
}
