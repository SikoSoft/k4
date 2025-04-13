import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@/components/meta-info/meta-info';
import '@/components/person-info/person-info';
import '@/components/asset-record/asset-record';

import { PersonInfoChangedEvent } from '../person-info/person-info.events';
import { MetaInfoChangedEvent } from '../meta-info/meta-info.events';

@customElement('k4-form')
export class K4Form extends LitElement {
  @state()
  year = '';

  @state()
  date = '';

  @state()
  pageNumber = '';

  @state()
  name = '';

  @state()
  personNumber = '';

  updateMetaInfo(event: MetaInfoChangedEvent) {
    const { year, date, pageNumber } = event.detail;
    console.log('updateMetaInfo', event.detail);
    this.year = year;
    this.date = date;
    this.pageNumber = pageNumber;
  }

  updatePersonInfo(event: PersonInfoChangedEvent) {
    const { name, personNumber } = event.detail;
    console.log('updatePersonInfo', event.detail);
    this.name = name;
    this.personNumber = personNumber;
  }

  render() {
    return html`<div class="k4">
      <meta-info
        @meta-info-changed=${this.updateMetaInfo}
        year=${this.year}
        date=${this.date}
        pageNumber=${this.pageNumber}
      ></meta-info
      ><person-info
        @person-info-changed=${this.updatePersonInfo}
        name=${this.name}
        personNumber=${this.personNumber}
      ></person-info>

      <asset-record
        total="3"
        asset="BTC"
        sellPrice="1000"
        buyPrice="500"
        gain="500"
        loss="0"
      ></asset-record>
    </div>`;
  }
}
