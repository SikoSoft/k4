import { Settings } from '@/models/Settings';

export const settingsChangedEventName = 'settings-changed';

export interface SettingsChangedEventPayload extends Settings {}

export class SettingsChangedEvent extends CustomEvent<SettingsChangedEventPayload> {
  constructor(payload: SettingsChangedEventPayload) {
    super(settingsChangedEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
