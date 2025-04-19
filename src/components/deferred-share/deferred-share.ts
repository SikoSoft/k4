import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@ss/ui/components/ss-input';
import {
  DeferredShareProp,
  deferredShareProps,
  DeferredShareProps,
} from './deferred-share.models';
import { InputChangedEvent } from '@ss/ui/events/input-changed';
import {
  DeferredShareChangedEvent,
  DeferredShareChangedEventPayload,
} from './deferred-share.events';
import { translate } from '@/lib/Localization';
import { repeat } from 'lit/directives/repeat.js';
import {
  MetaInfoChangedEventPayload,
  MetaInfoChangedEvent,
} from '../meta-info/meta-info.events';
import {
  MetaInfoProp,
  MetaInfoProps,
  metaInfoProps,
} from '../meta-info/meta-info.models';
import { DeferredShareField } from '@/models/K4';

@customElement('deferred-share')
export class DeferredShare extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .deferred-share {
      display: flex;
      flex-direction: row;
      gap: 1rem;

      & > * {
        flex-grow: 1;
        display: inline-block;

        &:nth-child(1) {
          flex-grow: 4;
        }

        &:nth-child(2) {
          flex-grow: 1;
        }
      }
    }
  `;

  @property({ type: String })
  [DeferredShareProp.DEFERRED_SHARE_DESIGNATION]: DeferredShareProps[DeferredShareProp.DEFERRED_SHARE_DESIGNATION] =
    deferredShareProps[DeferredShareProp.DEFERRED_SHARE_DESIGNATION].default;

  @property({ type: Number })
  [DeferredShareProp.DEFERRED_SHARE_AMOUNT]: DeferredShareProps[DeferredShareProp.DEFERRED_SHARE_AMOUNT] =
    deferredShareProps[DeferredShareProp.DEFERRED_SHARE_AMOUNT].default;

  get fields(): DeferredShareProps {
    return {
      [DeferredShareProp.DEFERRED_SHARE_DESIGNATION]:
        this[DeferredShareProp.DEFERRED_SHARE_DESIGNATION],
      [DeferredShareProp.DEFERRED_SHARE_AMOUNT]:
        this[DeferredShareProp.DEFERRED_SHARE_AMOUNT],
    };
  }

  handleFieldChanged(field: DeferredShareProp, event: InputChangedEvent) {
    const value: string | number =
      deferredShareProps[field].control === 'text'
        ? event.detail.value
        : isNaN(parseInt(event.detail.value || '0'))
          ? 0
          : parseInt(event.detail.value || '0');

    this.sendChangedEvent({
      ...this.fields,
      [field]: value,
    });
  }

  sendChangedEvent(fields: DeferredShareProps) {
    this.dispatchEvent(new DeferredShareChangedEvent(fields));
  }

  fieldValue(field: DeferredShareField): string {
    return this[field] === 0 ? '' : this[field].toString();
  }
  render() {
    return html`<div class="deferred-share">
      ${repeat(
        Object.values(DeferredShareProp),
        field => field,
        field => html`
          <ss-input
            placeholder=${translate(`fieldPlaceholder.B.${field}`)}
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
