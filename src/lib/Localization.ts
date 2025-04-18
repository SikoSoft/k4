import {
  defaultLanguage,
  Language,
  LocalizationStringMap,
} from '@/models/Localization';
import svStrings from '@/lib/data/sv.json';

export class Localization {
  private language: Language;
  private languageMap: Record<Language, LocalizationStringMap> = {
    [Language.EN]: {},
    [Language.SV]: svStrings,
  };

  constructor() {
    this.language = defaultLanguage;
  }

  setLanguage(language: Language) {
    this.language = language;
  }

  translate(key: string): string {
    if (this.languageMap[this.language][key]) {
      return this.languageMap[this.language][key];
    }

    return key;
  }
}

export const localization = new Localization();
export const translate = localization.translate.bind(localization);
