import { InjectionToken } from '@angular/core';
import { SummernoteOptions } from './summernote-options';

export const NGX_SUMMERNOTE_CONFIG = new InjectionToken<SummernoteOptions>(
  'NGX_SUMMERNOTE_CONFIG'
);
