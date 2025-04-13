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

  handleNameChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      name: event.detail.value,
      personNumber: this[PersonInfoProp.PERSON_NUMBER],
    });
  }

  handlePersonNumberChanged(event: InputChangedEvent) {
    this.sendChangedEvent({
      name: this[PersonInfoProp.NAME],
      personNumber: event.detail.value,
    });
  }

  sendChangedEvent(payload: PersonInfoChangedEventPayload) {
    this.dispatchEvent(new PersonInfoChangedEvent(payload));
  }

  render() {
    return html`<div class="person-info">
      <div class="name">
        <ss-input
          placeholder="Name"
          @input-changed=${this.handleNameChanged}
        ></ss-input>
      </div>
      <div class="person-number">
        <ss-input
          placeholder="Person Number"
          @input-changed=${this.handlePersonNumberChanged}
        ></ss-input>
      </div>
    </div> `;
  }
}
