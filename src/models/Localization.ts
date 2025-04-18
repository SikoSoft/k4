export enum Language {
  EN = 'en',
  SV = 'sv',
}

export const defaultLanguage = Language.SV;

export type LocalizationStringMap = Record<string, string>;

export type LocalizationLanguageMap = Record<Language, LocalizationStringMap>;
