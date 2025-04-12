import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@/components/person-info/person-info';
import { PersonInfo } from '@/components/person-info/person-info';
import { PersonInfoChangedEvent } from '../person-info/person-info.events';

@customElement('k4-form')
export class K4Form extends LitElement {
  @state()
  name = '';

  @state()
  personNumber = '';

  updatePersonInfo(event: PersonInfoChangedEvent) {
    const { name, personNumber } = event.detail;
    console.log('updatePersonInfo', event.detail);
    this.name = name;
    this.personNumber = personNumber;
  }

  render() {
    return html`<person-info
      @person-info-changed=${this.updatePersonInfo}
      name=${this.name}
      personNumber=${this.personNumber}
    ></person-info>`;
  }
}
