import { HttpHeaders, HttpParams } from "@angular/common/http";

export interface SummernoteOptions {
  immediateAngularModelUpdate?: boolean;
  angularIgnoreAttrs?: string[];
  placeholder?: string;
  tabsize?: number;
  height?: number;
  uploadImagePath?: string;
  uploadImageRequestOptions?: {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  },
  toolbar?: any[];
  fontNames?: string[];
  callbacks?: any;
  buttons?: any;
  airMode?: boolean;
  popover?: any;
}
