import { SectionSummary } from '@/models/K4';

export const sectionSummaryChangedEventName = 'section-summary-changed';

export interface SectionSummaryChangedEventPayload extends SectionSummary {}

export class SectionSummaryChangedEvent extends CustomEvent<SectionSummaryChangedEventPayload> {
  constructor(payload: SectionSummaryChangedEventPayload) {
    super(sectionSummaryChangedEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
