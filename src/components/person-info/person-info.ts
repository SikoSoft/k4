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
import { Language } from '@/models/Localization';
import { LanguageController } from '@/components/language-controller/language-controller';
import { PersonInfoField, PersonInfo as PersonInfoModel } from '@/models/K4';
import { repeat } from 'lit/directives/repeat.js';

@customElement('person-info')
export class PersonInfo extends LitElement {
  private languageController = new LanguageController(this);

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

      .personNumber {
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

  @property({ type: Number })
  [PersonInfoProp.PAGE]: PersonInfoProps[PersonInfoProp.PAGE] =
    personInfoProps[PersonInfoProp.PAGE].default;

  get language(): Language {
    return this.languageController.language;
  }

  get fields(): PersonInfoModel {
    return {
      [PersonInfoProp.NAME]: this[PersonInfoProp.NAME],
      [PersonInfoProp.PERSON_NUMBER]: this[PersonInfoProp.PERSON_NUMBER],
      [PersonInfoProp.CITY]: this[PersonInfoProp.CITY],
      [PersonInfoProp.POST_CODE]: this[PersonInfoProp.POST_CODE],
    };
  }

  handleFieldChanged(field: PersonInfoField, event: InputChangedEvent) {
    const value = event.detail.value;

    this.sendChangedEvent({
      ...this.fields,
      [field]: value,
      page: this[PersonInfoProp.PAGE],
    });
  }

  sendChangedEvent(payload: PersonInfoChangedEventPayload) {
    this.dispatchEvent(new PersonInfoChangedEvent(payload));
  }

  render() {
    return html`<div class="person-info">
      ${repeat(
        Object.values(PersonInfoField),
        field => field,
        field =>
          html` <div class=${field}>
            <ss-input
              value=${this[field]}
              placeholder=${translate(`fieldPlaceholder.personInfo.${field}`)}
              @input-changed=${(event: InputChangedEvent) => {
                this.handleFieldChanged(field, event);
              }}
            ></ss-input>
          </div>`,
      )}
    </div> `;
  }
}
