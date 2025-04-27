import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import '@ss/ui/components/ss-input';
import '@ss/ui/components/ss-icon';
import {
  SettingsChangedEvent,
  SettingsChangedEventPayload,
} from './settings-modal.events';
import { translate } from '@/lib/Localization';
import { Language } from '@/models/Localization';
import {
  SettingsModalProp,
  SettingsModalProps,
  settingsModalProps,
} from './settings-modal.models';

@customElement('settings-modal')
export class SettingsModal extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    select {
      display: inline-block;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      width: 100%;
    }
  `;

  @property({ type: Object })
  [SettingsModalProp.SETTINGS]: SettingsModalProps[SettingsModalProp.SETTINGS] =
    settingsModalProps[SettingsModalProp.SETTINGS].default;

  sendChangedEvent(payload: SettingsChangedEventPayload) {
    this.dispatchEvent(new SettingsChangedEvent(payload));
  }

  render() {
    return html`<div class="settings-modal">
      <div class="setting">
        <label for="language">${translate('language')}</label>
        <select
          @change=${(e: Event) => {
            const target = e.target as HTMLSelectElement;
            this.sendChangedEvent({
              ...this.settings,
              language: target.value as Language,
            });
          }}
        >
          ${Object.values(Language).map(
            lang =>
              html`<option
                value="${lang}"
                ?selected=${lang === this.settings.language}
              >
                ${translate(`language.${lang}`)}
              </option>`,
          )}
        </select>
      </div>
    </div> `;
  }
}
