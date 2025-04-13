export const metaInfoChangedEventName = 'meta-info-changed';

export interface MetaInfoChangedEventPayload {
  year: string;
  date: string;
  pageNumber: string;
}

export class MetaInfoChangedEvent extends CustomEvent<MetaInfoChangedEventPayload> {
  constructor(payload: MetaInfoChangedEventPayload) {
    super(metaInfoChangedEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
