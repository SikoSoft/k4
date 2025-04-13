export const sectionSummaryChangedEventName = 'section-summary-changed';

export interface SectionSummaryChangedEventPayload {}

export class SectionSummaryChangedEvent extends CustomEvent<SectionSummaryChangedEventPayload> {
  constructor(payload: SectionSummaryChangedEventPayload) {
    super(sectionSummaryChangedEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
