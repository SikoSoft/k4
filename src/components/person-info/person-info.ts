import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@ss/ui/components/ss-input';
import {
  PersonInfoProp,
  personInfoProps,
  PersonInfoProps,
} from './person-info.models';
import { InputChangedEvent } from '@ss/ui/events/input-changed';
import {
  PersonInfoChangedEvent,
  PersonInfoChangedEventPayload,
} from './person-info.events';
import { translate } from '@/lib/Localization';

@customElement('person-info')
export class PersonInfo extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .person-info {
      display: flex;
      flex-direction: row;
      gap: 1rem;

      .name {
        flex-grow: 4;
      }

      .person-number {
        flex-grow: 1;
      }
    }
  `;

  @property({ type: String })
  [PersonInfoProp.NAME]: PersonInfoProps[PersonInfoProp.NAME] =
    personInfoProps[PersonInfoProp.NAME].default;

  @property({ type: String })
  [PersonInfoProp.PERSON_NUMBER]: PersonInfoProps[PersonInfoProp.PERSON_NUMBER] =
    personInfoProps[PersonInfoProp.PERSON_NUMBER].default;

  @property({ type: String })
  [PersonInfoProp.CITY]: PersonInfoProps[PersonInfoProp.CITY] =
    personInfoProps[PersonInfoProp.CITY].default;

  @property({ type: String })
  [PersonInfoProp.POST_CODE]: PersonInfoProps[PersonInfoProp.POST_CODE] =
    personInfoProps[PersonInfoProp.POST_CODE].default;

  handleNameChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      name: event.detail.value,
      personNumber: this[PersonInfoProp.PERSON_NUMBER],
      city: this[PersonInfoProp.CITY],
      postCode: this[PersonInfoProp.POST_CODE],
    });
  }

  handlePersonNumberChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      name: this[PersonInfoProp.NAME],
      personNumber: event.detail.value,
      city: this[PersonInfoProp.CITY],
      postCode: this[PersonInfoProp.POST_CODE],
    });
  }

  handleCityChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      name: this[PersonInfoProp.NAME],
      personNumber: this[PersonInfoProp.PERSON_NUMBER],
      city: event.detail.value,
      postCode: this[PersonInfoProp.POST_CODE],
    });
  }

  handlePostCodeChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      name: this[PersonInfoProp.NAME],
      personNumber: this[PersonInfoProp.PERSON_NUMBER],
      city: this[PersonInfoProp.CITY],
      postCode: event.detail.value,
    });
  }

  sendChangedEvent(payload: PersonInfoChangedEventPayload) {
    this.dispatchEvent(new PersonInfoChangedEvent(payload));
  }

  render() {
    return html`<div class="person-info">
      <div class="name">
        <ss-input
          value=${this[PersonInfoProp.NAME]}
          placeholder=${translate('fieldPlaceholder.personInfo.name')}
          @input-changed=${this.handleNameChanged}
        ></ss-input>
      </div>
      <div class="person-number">
        <ss-input
          value=${this[PersonInfoProp.PERSON_NUMBER]}
          placeholder=${translate('fieldPlaceholder.personInfo.personNumber')}
          @input-changed=${this.handlePersonNumberChanged}
        ></ss-input>
      </div>
      <div class="city">
        <ss-input
          value=${this[PersonInfoProp.CITY]}
          placeholder=${translate('fieldPlaceholder.personInfo.city')}
          @input-changed=${this.handleCityChanged}
        ></ss-input>
      </div>
      <div class="post-code">
        <ss-input
          value=${this[PersonInfoProp.POST_CODE]}
          placeholder=${translate('fieldPlaceholder.personInfo.postCode')}
          @input-changed=${this.handlePostCodeChanged}
        ></ss-input>
      </div>
    </div> `;
  }
}
