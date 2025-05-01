import { Language } from '@/models/Localization';

export const languageChangedEventName = 'language-changed';

export interface LanguageChangedEventPayload {
  language: Language;
}

export class LanguageChangedEvent extends CustomEvent<LanguageChangedEventPayload> {
  constructor(payload: LanguageChangedEventPayload) {
    super(languageChangedEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
