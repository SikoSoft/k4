import { K4 } from '@/lib/K4';
import { K4Page } from '@/models/K4';
import { DEFAULT_LANGUAGE, Language } from '@/models/Localization';
import { PropConfigMap, PropTypes } from '@/models/Prop';

export enum K4FormProp {
  LANGUAGE = 'language',
  FORM_DATA = 'formData',
  PAGE = 'page',
}

export interface K4FormProps extends PropTypes {
  [K4FormProp.LANGUAGE]: Language;
  [K4FormProp.FORM_DATA]: K4Page;
  [K4FormProp.PAGE]: number;
}

export const k4FormProps: PropConfigMap<K4FormProps> = {
  [K4FormProp.LANGUAGE]: {
    default: DEFAULT_LANGUAGE,
    control: 'text',
    description: 'Language for the form',
  },
  [K4FormProp.FORM_DATA]: {
    default: K4.getDefaultK4PageData(),
    control: 'text',
    description: 'Form data',
  },
  [K4FormProp.PAGE]: {
    default: 1,
    control: 'number',
    description: 'Page number of the form',
  },
};
