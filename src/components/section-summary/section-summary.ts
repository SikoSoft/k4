import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import '@ss/ui/components/ss-input';
import { InputChangedEvent } from '@ss/ui/events/input-changed';

import {
  SectionSummaryProp,
  sectionSummaryProps,
  SectionSummaryProps,
} from './section-summary.models';
import {
  SectionSummaryChangedEvent,
  SectionSummaryChangedEventPayload,
} from './section-summary.events';
import {
  SectionSummaryField,
  SectionSummary as SectionSummaryModel,
} from '@/models/K4';
import { translate } from '@/lib/Localization';
import { Language } from '@/models/Localization';
import { LanguageController } from '@/components/language-controller/language-controller';

@customElement('section-summary')
export class SectionSummary extends LitElement {
  private languageController = new LanguageController(this);
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

  @property({ type: String })
  [SectionSummaryProp.SECTION]: SectionSummaryProps[SectionSummaryProp.SECTION] =
    sectionSummaryProps[SectionSummaryProp.SECTION].default;

  @property({ type: Number })
  [SectionSummaryProp.PAGE]: SectionSummaryProps[SectionSummaryProp.PAGE] =
    sectionSummaryProps[SectionSummaryProp.PAGE].default;

  get language(): Language {
    return this.languageController.language;
  }

  get fields(): SectionSummaryModel {
    return {
      [SectionSummaryProp.TOTAL_SELL_PRICE]:
        this[SectionSummaryProp.TOTAL_SELL_PRICE],
      [SectionSummaryProp.TOTAL_BUY_PRICE]:
        this[SectionSummaryProp.TOTAL_BUY_PRICE],
      [SectionSummaryProp.TOTAL_GAIN]: this[SectionSummaryProp.TOTAL_GAIN],
      [SectionSummaryProp.TOTAL_LOSS]: this[SectionSummaryProp.TOTAL_LOSS],
    };
  }

  handleFieldChanged(field: SectionSummaryField, event: InputChangedEvent) {
    const value = isNaN(parseInt(event.detail.value || '0'))
      ? 0
      : parseInt(event.detail.value || '0');

    this.sendChangedEvent({
      ...this.fields,
      [field]: value,
      section: this.section,
      page: this.page,
    });
  }

  sendChangedEvent(payload: SectionSummaryChangedEventPayload) {
    this.dispatchEvent(new SectionSummaryChangedEvent(payload));
  }

  fieldValue(field: SectionSummaryField): string {
    return this[field] === 0 ? '' : this[field].toString();
  }

  render() {
    return html`<div class="section-summary">
      <ss-input class="layout-filler"></ss-input>
      <ss-input class="layout-filler"></ss-input>
      ${repeat(
        Object.values(SectionSummaryField),
        field => field,
        field => html`
          <ss-input
            placeholder=${translate(
              `fieldPlaceholder.${this.section}.summary.${field}`,
            )}
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
