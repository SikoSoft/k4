import { DeferredShare } from '@/models/K4';

export const deferredShareChangedEventName = 'deferred-share-changed';

export interface DeferredShareChangedEventPayload extends DeferredShare {}

export class DeferredShareChangedEvent extends CustomEvent<DeferredShareChangedEventPayload> {
  constructor(payload: DeferredShareChangedEventPayload) {
    super(deferredShareChangedEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
