import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@ss/ui/components/ss-input';
import { MetaInfoProp, metaInfoProps, MetaInfoProps } from './meta-info.models';
import { InputChangedEvent } from '@ss/ui/events/input-changed';
import {
  MetaInfoChangedEvent,
  MetaInfoChangedEventPayload,
} from './meta-info.events';

@customElement('meta-info')
export class MetaInfo extends LitElement {
  @property()
  [MetaInfoProp.YEAR]: MetaInfoProps[MetaInfoProp.YEAR] =
    metaInfoProps[MetaInfoProp.YEAR].default;

  @property()
  [MetaInfoProp.DATE]: MetaInfoProps[MetaInfoProp.DATE] =
    metaInfoProps[MetaInfoProp.DATE].default;

  @property()
  [MetaInfoProp.PAGE_NUMBER]: MetaInfoProps[MetaInfoProp.PAGE_NUMBER] =
    metaInfoProps[MetaInfoProp.PAGE_NUMBER].default;

  handleYearChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      year: event.detail.value,
      date: this[MetaInfoProp.DATE],
      pageNumber: this[MetaInfoProp.PAGE_NUMBER],
    });
  }

  handleDateChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      year: this[MetaInfoProp.YEAR],
      date: event.detail.value,
      pageNumber: this[MetaInfoProp.PAGE_NUMBER],
    });
  }

  handlePageNumberChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      year: this[MetaInfoProp.YEAR],
      date: this[MetaInfoProp.DATE],
      pageNumber: event.detail.value,
    });
  }

  sendChangedEvent(payload: MetaInfoChangedEventPayload) {
    this.dispatchEvent(new MetaInfoChangedEvent(payload));
  }

  render() {
    return html`<div>
      <ss-input
        placeholder="Year"
        @input-changed=${this.handleYearChanged}
      ></ss-input>
      <ss-input
        placeholder="Date"
        @input-changed=${this.handleDateChanged}
      ></ss-input>
      <ss-input
        placeholder="Page Number"
        @input-changed=${this.handlePageNumberChanged}
      ></ss-input>
    </div> `;
  }
}
