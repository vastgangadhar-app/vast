import {I18n} from 'i18n-js';
import en from './en.json';
import gj from './gj.json';
import hi from './hi.json';
import kn from './kn.json';
import mh from './mh.json';
import tl from './tl.json';
import tn from './tn.json';

const i18n = new I18n({
  en,
  gj,
  hi,
  kn,
  mh,
  tl,
  tn,
});
i18n.defaultLocale = 'en';
i18n.locale = 'en';

export const translate = (key: string, options?: any) => i18n.t(key, options);
