import { SectionSummary, SectionType } from '@/models/K4';

export const sectionSummaryChangedEventName = 'section-summary-changed';

export interface SectionSummaryChangedEventPayload extends SectionSummary {
  section: SectionType;
  page: number;
}

export class SectionSummaryChangedEvent extends CustomEvent<SectionSummaryChangedEventPayload> {
  constructor(payload: SectionSummaryChangedEventPayload) {
    super(sectionSummaryChangedEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
