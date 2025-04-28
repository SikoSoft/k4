import { K4 } from '@/lib/K4';
import { DEFAULT_LANGUAGE, Language } from '@/models/Localization';
import { PropConfigMap, PropTypes } from '@/models/Prop';

export enum K4FormProp {
  LANGUAGE = 'language',
}

export interface K4FormProps extends PropTypes {
  [K4FormProp.LANGUAGE]: Language;
}

export const k4FormProps: PropConfigMap<K4FormProps> = {
  [K4FormProp.LANGUAGE]: {
    default: DEFAULT_LANGUAGE,
    control: 'text',
    description: 'Language for the form',
  },
};
