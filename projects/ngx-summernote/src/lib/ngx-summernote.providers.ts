import { SummernoteOptions } from './summernote-options';
import { NGX_SUMMERNOTE_CONFIG } from './ngx-summernote.config';

export function provideNgxSummerNodeConfig(config: Partial<SummernoteOptions>) {
  return {
    provide: NGX_SUMMERNOTE_CONFIG,
    useValue: config
  };
}
