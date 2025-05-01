import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Language } from '@/models/Localization';
import { getLanguage } from '@/lib/Localization';

export class LanguageController implements ReactiveController {
  private host: ReactiveControllerHost;
  private _language: Language;
  private boundLanguageChangeHandler: (e: CustomEvent) => void;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    this._language = getLanguage();
    host.addController(this);
    this.boundLanguageChangeHandler = this.handleLanguageChange.bind(this);
  }

  hostConnected() {
    window.addEventListener(
      'language-changed',
      this.boundLanguageChangeHandler as EventListener,
    );
  }

  hostDisconnected() {
    window.removeEventListener(
      'language-changed',
      this.boundLanguageChangeHandler as EventListener,
    );
  }

  handleLanguageChange(event: CustomEvent) {
    this._language = event.detail.language;
    this.host.requestUpdate();
  }

  get language(): Language {
    return this._language;
  }
}
