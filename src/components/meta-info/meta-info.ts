import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@ss/ui/components/ss-input';
import { MetaInfoProp, metaInfoProps, MetaInfoProps } from './meta-info.models';
import { InputChangedEvent } from '@ss/ui/events/input-changed';
import {
  MetaInfoChangedEvent,
  MetaInfoChangedEventPayload,
} from './meta-info.events';
import { translate } from '@/lib/Localization';
import { Language } from '@/models/Localization';
import { LanguageController } from '@/components/language-controller/language-controller';

@customElement('meta-info')
export class MetaInfo extends LitElement {
  private languageController = new LanguageController(this);

  static styles = css`
    :host {
      display: block;
    }

    .meta-info {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      justify-content: end;

      .year {
        flex-grow: 1;
      }

      .page-number {
        flex-grow: 1;
      }
    }
  `;

  @property()
  [MetaInfoProp.YEAR]: MetaInfoProps[MetaInfoProp.YEAR] =
    metaInfoProps[MetaInfoProp.YEAR].default;

  @property()
  [MetaInfoProp.PAGE_NUMBER]: MetaInfoProps[MetaInfoProp.PAGE_NUMBER] =
    metaInfoProps[MetaInfoProp.PAGE_NUMBER].default;

  get language(): Language {
    return this.languageController.language;
  }

  handleYearChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      year: event.detail.value,
      pageNumber: this[MetaInfoProp.PAGE_NUMBER],
    });
  }

  handleDateChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      year: this[MetaInfoProp.YEAR],
      pageNumber: this[MetaInfoProp.PAGE_NUMBER],
    });
  }

  handlePageNumberChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      year: this[MetaInfoProp.YEAR],
      pageNumber: event.detail.value,
    });
  }

  sendChangedEvent(payload: MetaInfoChangedEventPayload) {
    this.dispatchEvent(new MetaInfoChangedEvent(payload));
  }

  render() {
    return html`<div class="meta-info">
      <ss-input
        placeholder=${translate('fieldPlaceholder.metaInfo.year')}
        value=${this[MetaInfoProp.YEAR]}
        @input-changed=${this.handleYearChanged}
      ></ss-input>

      <ss-input
        placeholder=${translate('fieldPlaceholder.metaInfo.pageNumber')}
        value=${this[MetaInfoProp.PAGE_NUMBER]}
        @input-changed=${this.handlePageNumberChanged}
      ></ss-input>
    </div> `;
  }
}
