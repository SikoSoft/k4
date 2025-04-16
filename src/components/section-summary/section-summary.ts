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
import { SectionSummaryField } from '@/models/K4';

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
      justify-content: space-between;

      & > * {
        flex-grow: 1;
      }

      .layout-filler {
        visibility: hidden;
      }
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

  get fields(): SectionSummaryProps {
    return {
      [SectionSummaryProp.TOTAL_SELL_PRICE]:
        this[SectionSummaryProp.TOTAL_SELL_PRICE],
      [SectionSummaryProp.TOTAL_BUY_PRICE]:
        this[SectionSummaryProp.TOTAL_BUY_PRICE],
      [SectionSummaryProp.TOTAL_GAIN]: this[SectionSummaryProp.TOTAL_GAIN],
      [SectionSummaryProp.TOTAL_LOSS]: this[SectionSummaryProp.TOTAL_LOSS],
    };
  }

  handleFieldChanged(field: SectionSummaryProp, event: InputChangedEvent) {
    console.log('handleFieldChanged', field, event);
    this.sendChangedEvent({
      ...this.fields,
      [field]: parseInt(event.detail.value),
    });
  }

  sendChangedEvent(fields: SectionSummaryProps) {
    console.log('sendChangedEvent', fields);
    this.dispatchEvent(new SectionSummaryChangedEvent(fields));
  }

  fieldValue(field: SectionSummaryField): string {
    return this[field] === 0 ? '' : this[field].toString();
  }

  render() {
    return html`<div class="section-summary">
      <ss-input class="layout-filler"></ss-input>
      <ss-input class="layout-filler"></ss-input>
      ${repeat(
        Object.values(SectionSummaryProp),
        field => field,
        field => html`
          <ss-input
            placeholder=${field}
            value=${this.fieldValue(field)}
            @input-changed=${(event: InputChangedEvent) => {
              this.handleFieldChanged(field, event);
            }}
          ></ss-input>
        `,
      )}
    </div> `;
  }
}
