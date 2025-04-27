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

  translate(key: string, replacement: Record<string, string> = {}): string {
    let returnString = key;
    if (this.languageMap[this.language][key]) {
      returnString = this.languageMap[this.language][key];
    }

    if (replacement) {
      Object.keys(replacement).forEach(key => {
        returnString = returnString.replace(`{${key}}`, replacement[key]);
      });
    }

    return returnString;
  }
}

export const localization = new Localization();
export const translate = localization.translate.bind(localization);
