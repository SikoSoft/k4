import { MetaInfo } from '@/models/K4';

export const metaInfoChangedEventName = 'meta-info-changed';

export interface MetaInfoChangedEventPayload extends MetaInfo {}

export class MetaInfoChangedEvent extends CustomEvent<MetaInfoChangedEventPayload> {
  constructor(payload: MetaInfoChangedEventPayload) {
    super(metaInfoChangedEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
