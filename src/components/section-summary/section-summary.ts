import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import '@ss/ui/components/ss-input';
import {
  InputChangedEvent,
  InputChangedEventPayload,
} from '@ss/ui/events/input-changed';

import {
  SectionSummaryProp,
  sectionSummaryProps,
  SectionSummaryProps,
} from './section-summary.models';
import {
  SectionSummaryChangedEvent,
  SectionSummaryChangedEventPayload,
} from './section-summary.events';

@customElement('section-summary')
export class SectionSummary extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .section-summary {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }
  `;

  @property({ type: Number })
  [SectionSummaryProp.TOTAL_SELL_PRICE]: SectionSummaryProps[SectionSummaryProp.TOTAL_SELL_PRICE] =
    sectionSummaryProps[SectionSummaryProp.TOTAL_SELL_PRICE].default;

  @property({ type: Number })
  [SectionSummaryProp.TOTAL_BUY_PRICE]: SectionSummaryProps[SectionSummaryProp.TOTAL_BUY_PRICE] =
    sectionSummaryProps[SectionSummaryProp.TOTAL_BUY_PRICE].default;

  @property({ type: Number })
  [SectionSummaryProp.TOTAL_GAIN]: SectionSummaryProps[SectionSummaryProp.TOTAL_GAIN] =
    sectionSummaryProps[SectionSummaryProp.TOTAL_GAIN].default;

  @property({ type: Number })
  [SectionSummaryProp.TOTAL_LOSS]: SectionSummaryProps[SectionSummaryProp.TOTAL_LOSS] =
    sectionSummaryProps[SectionSummaryProp.TOTAL_LOSS].default;

  handleFieldChanged(field: SectionSummaryProp, event: InputChangedEvent) {
    console.log('handleFieldChanged', field, event);
  }

  sendChangedEvent(
    field: SectionSummaryProp,
    payload: InputChangedEventPayload,
  ) {
    console.log();
  }

  render() {
    return html`<div class="section-summary">
      ${repeat(
        Object.values(SectionSummaryProp),
        field => field,
        field => html`
          <ss-input
            placeholder=${field}
            value=${this[field]}
            @input-changed=${(event: InputChangedEvent) => {
              this.handleFieldChanged(field, event);
            }}
          ></ss-input>
        `,
      )}
    </div> `;
  }
}
