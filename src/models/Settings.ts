import { DEFAULT_LANGUAGE, Language } from './Localization';

export enum SettingName {
  LANGUAGE = 'language',
  SHOW_PREVIEW = 'showPreview',
}

export type Settings = {
  [SettingName.LANGUAGE]: Language;
  [SettingName.SHOW_PREVIEW]: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  [SettingName.LANGUAGE]: DEFAULT_LANGUAGE,
  [SettingName.SHOW_PREVIEW]: true,
};
