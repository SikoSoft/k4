export enum Language {
  EN = 'en',
  SV = 'sv',
}

export const DEFAULT_LANGUAGE = Language.SV;

export type LocalizationStringMap = Record<string, string>;

export type LocalizationLanguageMap = Record<Language, LocalizationStringMap>;
