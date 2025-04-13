import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import '@ss/ui/components/ss-input';
import {
  InputChangedEvent,
  InputChangedEventPayload,
} from '@ss/ui/events/input-changed';

import {
  AssetRecordProp,
  assetRecordProps,
  AssetRecordProps,
} from './asset-record.models';
import {
  AssetRecordChangedEvent,
  AssetRecordChangedEventPayload,
} from './asset-record.events';
import { AssetRecordField } from '@/models/K4';

@customElement('asset-record')
export class AssetRecord extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .asset-record {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }
  `;

  @property({ type: Number })
  [AssetRecordProp.TOTAL]: AssetRecordProps[AssetRecordProp.TOTAL] =
    assetRecordProps[AssetRecordProp.TOTAL].default;

  @property({ type: String })
  [AssetRecordProp.ASSET]: AssetRecordProps[AssetRecordProp.ASSET] =
    assetRecordProps[AssetRecordProp.ASSET].default;

  @property({ type: Number })
  [AssetRecordProp.BUY_PRICE]: AssetRecordProps[AssetRecordProp.BUY_PRICE] =
    assetRecordProps[AssetRecordProp.BUY_PRICE].default;

  @property({ type: Number })
  [AssetRecordProp.SELL_PRICE]: AssetRecordProps[AssetRecordProp.SELL_PRICE] =
    assetRecordProps[AssetRecordProp.SELL_PRICE].default;

  @property({ type: Number })
  [AssetRecordProp.GAIN]: AssetRecordProps[AssetRecordProp.GAIN] =
    assetRecordProps[AssetRecordProp.GAIN].default;

  @property({ type: Number })
  [AssetRecordProp.LOSS]: AssetRecordProps[AssetRecordProp.LOSS] =
    assetRecordProps[AssetRecordProp.LOSS].default;

  handleFieldChanged(field: AssetRecordProp, event: InputChangedEvent) {
    console.log('handleFieldChanged', field, event);

    const value: string | number =
      assetRecordProps[field].control === 'number'
        ? parseInt(event.detail.value)
        : event.detail.value;

    this.sendChangedEvent({
      ...(Object.fromEntries(
        Object.values(AssetRecordField).map(key => [key, this[key]]),
      ) as unknown as AssetRecordProps),
      [field]: value,
    });
  }

  sendChangedEvent(payload: AssetRecordChangedEventPayload) {
    console.log('sendChangedEvent', payload);
    this.dispatchEvent(new AssetRecordChangedEvent(payload));
  }

  render() {
    return html`<div class="asset-record">
      ${repeat(
        Object.values(AssetRecordProp),
        field => field,
        field => html`
          <ss-input
            placeholder=${field}
            value=${this[field]}
            @input-changed=${(event: InputChangedEvent) => {
              this.handleFieldChanged(field, event);
            }}
          ></ss-input>
        `,
      )}
    </div> `;
  }
}
